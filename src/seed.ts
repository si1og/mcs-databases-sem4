import { faker } from "@faker-js/faker";
import { pool } from "./db.js";
import {
  COUNTS,
  categoryNames,
  categoryDescs,
  formats,
  osNames,
  osVersions,
  weights,
  slopes,
  licenseTypes,
  installStatuses,
  alphabetStatuses,
  storageTypes,
  scriptTypes,
  writingDirs,
  gpus,
  processors,
  tables,
} from "./constants.js";
import type { PoolClient } from "pg";

class Seeder {
  private client!: PoolClient;
  private osIds: number[] = [];
  private pubIds: number[] = [];
  private catIds: number[] = [];
  private fmtIds: number[] = [];
  private langIds: number[] = [];
  private wsIds: number[] = [];
  private ffIds: number[] = [];
  private allTfIds: number[] = [];
  private ffPublishers: Map<number, number> = new Map();

  async run() {
    this.client = await pool.connect();
    try {
      await this.client.query("BEGIN");

      await this.seedOS();
      await this.seedPublishers();
      await this.seedCategories();
      await this.seedFormats();
      await this.seedLanguages();
      await this.seedWorkstations();
      await this.seedFontFamiliesAndTypefaces();
      await this.updateCategoryCounts();
      await this.seedLicenses();
      await this.seedAlphabets();
      await this.seedInstallations();

      await this.client.query("COMMIT");
      console.log("\nSeeding complete!");
      await this.printSummary();
    } catch (e) {
      await this.client.query("ROLLBACK");
      throw e;
    } finally {
      this.client.release();
      await pool.end();
    }
  }

  private async seedOS() {
    for (let i = 0; i < COUNTS.os; i++) {
      const name = osNames[i % osNames.length];
      const version = faker.helpers.arrayElement(osVersions[name]);
      const res = await this.client.query(
        "INSERT INTO OS (Name, Version, Bitness, Release_year) VALUES ($1, $2, $3, $4) RETURNING id_OS",
        [name, version, 64, faker.number.int({ min: 2020, max: 2025 })],
      );
      this.osIds.push(res.rows[0].id_os);
    }
    console.log(`OS: ${this.osIds.length}`);
  }

  private async seedPublishers() {
    for (let i = 0; i < COUNTS.publishers; i++) {
      const res = await this.client.query(
        "INSERT INTO Publisher (Name, Country, Website, Foundation_year, Email) VALUES ($1, $2, $3, $4, $5) RETURNING id_Publisher",
        [
          faker.company.name() + " Type",
          faker.location.country(),
          faker.internet.url(),
          faker.number.int({ min: 1880, max: 2020 }),
          faker.helpers.maybe(() => faker.internet.email(), {
            probability: 0.8,
          }) ?? null,
        ],
      );
      this.pubIds.push(res.rows[0].id_publisher);
    }
    console.log(`Publisher: ${this.pubIds.length}`);
  }

  private async seedCategories() {
    for (const name of categoryNames.slice(0, COUNTS.categories)) {
      const res = await this.client.query(
        "INSERT INTO Category (Name, Description, Font_family_count) VALUES ($1, $2, 0) RETURNING id_Category",
        [name, categoryDescs[name]],
      );
      this.catIds.push(res.rows[0].id_category);
    }
    console.log(`Category: ${this.catIds.length}`);
  }

  private async seedFormats() {
    for (const f of formats.slice(0, COUNTS.formats)) {
      const res = await this.client.query(
        "INSERT INTO Format (Name, Extension, Year_released, Description, Web_support) VALUES ($1, $2, $3, $4, $5) RETURNING id_Format",
        [f.name, f.ext, f.year, f.desc, f.web],
      );
      this.fmtIds.push(res.rows[0].id_format);
    }
    console.log(`Format: ${this.fmtIds.length}`);
  }

  private async seedLanguages() {
    for (let i = 0; i < COUNTS.languages; i++) {
      const res = await this.client.query(
        "INSERT INTO Language (Name, ISO_code, Writing_direction, Script_type) VALUES ($1, $2, $3, $4) RETURNING id_Language",
        [
          faker.location.country(),
          faker.string.alpha({ length: 3, casing: "lower" }),
          faker.helpers.arrayElement(writingDirs),
          faker.helpers.arrayElement(scriptTypes),
        ],
      );
      this.langIds.push(res.rows[0].id_language);
    }
    console.log(`Language: ${this.langIds.length}`);
  }

  private async seedWorkstations() {
    for (let i = 0; i < COUNTS.workstations; i++) {
      const num = String(i + 1).padStart(4, "0");
      const res = await this.client.query(
        "INSERT INTO Workstation (Inventory_number, Processor, Memory_size, Storage_type, Graphics_adapter, id_OS) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id_Workstation",
        [
          `WS-2024-${num}`,
          faker.helpers.arrayElement(processors),
          faker.helpers.arrayElement([16384, 32768, 65536]),
          faker.helpers.arrayElement(storageTypes),
          faker.helpers.arrayElement(gpus),
          faker.helpers.arrayElement(this.osIds),
        ],
      );
      this.wsIds.push(res.rows[0].id_workstation);
    }
    console.log(`Workstation: ${this.wsIds.length}`);
  }

  private async seedFontFamiliesAndTypefaces() {
    for (let i = 0; i < COUNTS.fontFamilies; i++) {
      const familyName = faker.lorem.word({ length: { min: 4, max: 10 } });
      const capName = familyName.charAt(0).toUpperCase() + familyName.slice(1);
      const tfCount = faker.number.int(COUNTS.typefacesPerFamily);
      const pubId = faker.helpers.arrayElement(this.pubIds);
      const fmtId = faker.helpers.arrayElement(this.fmtIds.slice(0, 2));

      const res = await this.client.query(
        "INSERT INTO Font_family (Name, Year_created, Description, Typeface_count, id_Publisher, id_Category) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id_Font_family",
        [
          capName,
          faker.number.int({ min: 1980, max: 2024 }),
          faker.lorem.sentence(),
          tfCount,
          pubId,
          faker.helpers.arrayElement(this.catIds),
        ],
      );
      const ffId = res.rows[0].id_font_family;
      this.ffIds.push(ffId);
      this.ffPublishers.set(ffId, pubId);

      for (let j = 0; j < tfCount; j++) {
        const w = weights[j % weights.length];
        const s = faker.helpers.arrayElement(slopes);
        const tfName = `${capName} ${w}${s !== "Upright" ? " " + s : ""}`;

        const tfRes = await this.client.query(
          "INSERT INTO Typeface (Name, Weight, Slope, File_size, id_Font_family, id_Format) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id_Typeface",
          [
            tfName,
            w,
            s,
            faker.number.int({ min: 30000, max: 400000 }),
            ffId,
            fmtId,
          ],
        );
        this.allTfIds.push(tfRes.rows[0].id_typeface);
      }

      if ((i + 1) % 100 === 0)
        console.log(`  Font_family: ${i + 1}/${COUNTS.fontFamilies}`);
    }
    console.log(`Font_family: ${this.ffIds.length}`);
    console.log(`Typeface: ${this.allTfIds.length}`);
  }

  private async updateCategoryCounts() {
    await this.client.query(`
      UPDATE Category SET Font_family_count = (
        SELECT COUNT(*) FROM Font_family WHERE Font_family.id_Category = Category.id_Category
      )
    `);
  }

  private async seedLicenses() {
    let count = 0;
    for (const ffId of this.ffIds) {
      const pubId = this.ffPublishers.get(ffId)!;
      const licType = faker.helpers.arrayElement(licenseTypes);

      await this.client.query(
        "INSERT INTO License (Type, Expiration_date, Max_stations, Cost, Purchase_date, id_Publisher, id_Font_family) VALUES ($1, $2, $3, $4, $5, $6, $7)",
        [
          licType,
          licType === "Subscription"
            ? faker.date.future().toISOString().split("T")[0]
            : null,
          licType === "OFL" ? null : faker.number.int({ min: 5, max: 50 }),
          licType === "OFL" || licType === "Freeware"
            ? 0
            : faker.number.float({ min: 50, max: 500, fractionDigits: 2 }),
          faker.date.past({ years: 3 }).toISOString().split("T")[0],
          pubId,
          ffId,
        ],
      );
      count++;
    }
    console.log(`License: ${count}`);
  }

  private async seedAlphabets() {
    let count = 0;
    for (let i = 0; i < this.allTfIds.length; i++) {
      const tfId = this.allTfIds[i];
      const n = faker.number.int(COUNTS.alphabetsPerTypeface);
      const selectedLangs = faker.helpers.arrayElements(
        this.langIds,
        Math.min(n, this.langIds.length),
      );

      for (const langId of selectedLangs) {
        await this.client.query(
          "INSERT INTO Alphabet (Typeface_count_in_system, Supported_family_count, Verification_date, Status, id_Typeface, id_Language) VALUES ($1, $2, $3, $4, $5, $6)",
          [
            faker.number.int({ min: 5, max: 100 }),
            faker.number.int({ min: 1, max: 20 }),
            faker.helpers.maybe(
              () => faker.date.past().toISOString().split("T")[0],
              { probability: 0.7 },
            ) ?? null,
            faker.helpers.arrayElement(alphabetStatuses),
            tfId,
            langId,
          ],
        );
        count++;
      }

      if ((i + 1) % 500 === 0)
        console.log(
          `  Alphabet progress: ${i + 1}/${this.allTfIds.length} typefaces`,
        );
    }
    console.log(`Alphabet: ${count}`);
  }

  private async seedInstallations() {
    let count = 0;
    for (let i = 0; i < this.wsIds.length; i++) {
      const wsId = this.wsIds[i];
      const n = faker.number.int(COUNTS.installationsPerWorkstation);
      const selectedTfs = faker.helpers.arrayElements(
        this.allTfIds,
        Math.min(n, this.allTfIds.length),
      );

      for (const tfId of selectedTfs) {
        const isRemoved = faker.datatype.boolean({ probability: 0.1 });
        const installDate = faker.date
          .past({ years: 2 })
          .toISOString()
          .split("T")[0];

        await this.client.query(
          "INSERT INTO Installation (Installation_date, Removal_date, File_path, Status, Last_used_date, id_Typeface, id_Workstation) VALUES ($1, $2, $3, $4, $5, $6, $7)",
          [
            installDate,
            isRemoved ? faker.date.recent().toISOString().split("T")[0] : null,
            `/usr/share/fonts/f${tfId}${faker.helpers.arrayElement([".ttf", ".otf"])}`,
            isRemoved ? "removed" : faker.helpers.arrayElement(installStatuses),
            isRemoved ? null : faker.date.recent().toISOString().split("T")[0],
            tfId,
            wsId,
          ],
        );
        count++;
      }

      if ((i + 1) % 20 === 0)
        console.log(
          `  Installation progress: ${i + 1}/${this.wsIds.length} workstations`,
        );
    }
    console.log(`Installation: ${count}`);
  }

  private async printSummary() {
    let total = 0;
    console.log("\nTable counts:");
    for (const t of tables) {
      const res = await pool.query(`SELECT COUNT(*) FROM ${t}`);
      const c = parseInt(res.rows[0].count);
      total += c;
      console.log(`  ${t}: ${c}`);
    }
    console.log(`  TOTAL: ${total}`);
  }
}

new Seeder().run().catch(console.error);
