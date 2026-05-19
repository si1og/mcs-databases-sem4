import { faker } from "@faker-js/faker";
import { pool } from "./db.js";
import {
  BASE_COUNTS,
  COEFFICIENTS,
  COUNTS,
  categoryNames,
  categoryDescs,
  formats,
  languages,
  weights,
  slopes,
  alphabetStatuses,
  tables,
} from "./constants.js";
import type { PoolClient } from "pg";

type IdMap = Map<string, number>;

type TypefaceRow = {
  id: number;
  fontFamilyId: number;
};

class Seeder {
  private client!: PoolClient;

  private categoryIds: number[] = [];
  private formatIds: number[] = [];
  private languageIds: number[] = [];
  private fontFamilyIds: number[] = [];
  private typefaces: TypefaceRow[] = [];

  private weightIds: IdMap = new Map();
  private slopeIds: IdMap = new Map();
  private extensionIds: IdMap = new Map();
  private writingDirectionIds: IdMap = new Map();
  private scriptTypeIds: IdMap = new Map();

  async run() {
    this.client = await pool.connect();

    try {
      await this.client.query("BEGIN");

      await this.clearTables();

      await this.seedDictionaries();

      await this.seedCategories();
      await this.seedFormats();
      await this.seedLanguages();

      await this.seedFontFamilies();
      await this.seedTypefaces();
      await this.seedAlphabets();

      await this.updateAlphabetCounts();
      await this.updateCategoryCounts();

      await this.client.query("COMMIT");

      console.log("\nSeeding complete!");
      await this.printSummary();
    } catch (error) {
      await this.client.query("ROLLBACK");
      throw error;
    } finally {
      this.client.release();
      await pool.end();
    }
  }

  private async clearTables() {
    await this.client.query(`
      TRUNCATE TABLE
        Alphabet,
        Typeface,
        Font_family,
        Language,
        Format,
        Category,
        Weight,
        Slope,
        Extension,
        Writing_direction,
        Script_type
      RESTART IDENTITY CASCADE
    `);

    console.log("Tables cleared");
  }

  private async seedDictionaries() {
    await this.seedWeightDictionary();
    await this.seedSlopeDictionary();
    await this.seedExtensionDictionary();
    await this.seedWritingDirectionDictionary();
    await this.seedScriptTypeDictionary();
  }

  private async seedWeightDictionary() {
    for (const name of weights) {
      const result = await this.client.query(
        `
        INSERT INTO Weight (Name)
        VALUES ($1)
        RETURNING id_Weight
        `,
        [name],
      );

      this.weightIds.set(name, result.rows[0].id_weight);
    }

    console.log(`Weight: ${this.weightIds.size}`);
  }

  private async seedSlopeDictionary() {
    for (const name of slopes) {
      const result = await this.client.query(
        `
        INSERT INTO Slope (Name)
        VALUES ($1)
        RETURNING id_Slope
        `,
        [name],
      );

      this.slopeIds.set(name, result.rows[0].id_slope);
    }

    console.log(`Slope: ${this.slopeIds.size}`);
  }

  private async seedExtensionDictionary() {
    const uniqueExtensions = [...new Set(formats.map((format) => format.ext))];

    for (const extension of uniqueExtensions) {
      const result = await this.client.query(
        `
        INSERT INTO Extension (Name)
        VALUES ($1)
        RETURNING id_Extension
        `,
        [extension],
      );

      this.extensionIds.set(extension, result.rows[0].id_extension);
    }

    console.log(`Extension: ${this.extensionIds.size}`);
  }

  private async seedWritingDirectionDictionary() {
    const selectedLanguages = languages.slice(0, BASE_COUNTS.languages);
    const uniqueWritingDirections = [
      ...new Set(
        selectedLanguages.map((language) => language.writingDirection),
      ),
    ];

    for (const name of uniqueWritingDirections) {
      const result = await this.client.query(
        `
        INSERT INTO Writing_direction (Name)
        VALUES ($1)
        RETURNING id_Writing_direction
        `,
        [name],
      );

      this.writingDirectionIds.set(name, result.rows[0].id_writing_direction);
    }

    console.log(`Writing_direction: ${this.writingDirectionIds.size}`);
  }

  private async seedScriptTypeDictionary() {
    const selectedLanguages = languages.slice(0, BASE_COUNTS.languages);
    const uniqueScriptTypes = [
      ...new Set(selectedLanguages.map((language) => language.scriptType)),
    ];

    for (const name of uniqueScriptTypes) {
      const result = await this.client.query(
        `
        INSERT INTO Script_type (Name)
        VALUES ($1)
        RETURNING id_Script_type
        `,
        [name],
      );

      this.scriptTypeIds.set(name, result.rows[0].id_script_type);
    }

    console.log(`Script_type: ${this.scriptTypeIds.size}`);
  }

  private async seedCategories() {
    const selectedCategories = categoryNames.slice(0, BASE_COUNTS.categories);

    for (const name of selectedCategories) {
      const result = await this.client.query(
        `
        INSERT INTO Category
          (Name, Description, Icon, Font_family_count)
        VALUES
          ($1, $2, $3, 0)
        RETURNING id_Category
        `,
        [name, categoryDescs[name], `/icons/${this.slugify(name)}.svg`],
      );

      this.categoryIds.push(result.rows[0].id_category);
    }

    console.log(`Category: ${this.categoryIds.length}`);
  }

  private async seedFormats() {
    const selectedFormats = formats.slice(0, BASE_COUNTS.formats);

    for (const format of selectedFormats) {
      const extensionId = this.getRequiredId(
        this.extensionIds,
        format.ext,
        "Extension",
      );

      const result = await this.client.query(
        `
        INSERT INTO Format
          (Name, id_Extension, Year_released, Description, Web_support)
        VALUES
          ($1, $2, $3, $4, $5)
        RETURNING id_Format
        `,
        [format.name, extensionId, format.year, format.desc, format.web],
      );

      this.formatIds.push(result.rows[0].id_format);
    }

    console.log(`Format: ${this.formatIds.length}`);
  }

  private async seedLanguages() {
    const selectedLanguages = languages.slice(0, BASE_COUNTS.languages);

    for (const language of selectedLanguages) {
      const writingDirectionId = this.getRequiredId(
        this.writingDirectionIds,
        language.writingDirection,
        "Writing_direction",
      );

      const scriptTypeId = this.getRequiredId(
        this.scriptTypeIds,
        language.scriptType,
        "Script_type",
      );

      const result = await this.client.query(
        `
        INSERT INTO Language
          (
            Name,
            ISO_code,
            id_Writing_direction,
            id_Script_type
          )
        VALUES
          ($1, $2, $3, $4)
        RETURNING id_Language
        `,
        [language.name, language.iso, writingDirectionId, scriptTypeId],
      );

      this.languageIds.push(result.rows[0].id_language);
    }

    console.log(`Language: ${this.languageIds.length}`);
  }

  private async seedFontFamilies() {
    let created = 0;

    const batchSize = 1000;
    let values: unknown[] = [];
    let placeholders: string[] = [];

    for (const categoryId of this.categoryIds) {
      for (let i = 0; i < COEFFICIENTS.fontFamiliesPerCategory; i++) {
        const index = values.length;

        placeholders.push(
          `($${index + 1}, $${index + 2}, $${index + 3}, $${index + 4}, $${index + 5})`,
        );

        values.push(
          this.makeFontFamilyName(created),
          faker.number.int({ min: 1950, max: 2024 }),
          faker.lorem.sentence(),
          COEFFICIENTS.typefacesPerFamily,
          categoryId,
        );

        created++;

        if (placeholders.length >= batchSize) {
          await this.insertFontFamilyBatch(placeholders, values);
          values = [];
          placeholders = [];
        }
      }

      console.log(
        `  Font_family by category: ${this.categoryIds.indexOf(categoryId) + 1}/${this.categoryIds.length}`,
      );
    }

    if (placeholders.length > 0) {
      await this.insertFontFamilyBatch(placeholders, values);
    }

    console.log(`Font_family: ${this.fontFamilyIds.length}`);
  }

  private async insertFontFamilyBatch(
    placeholders: string[],
    values: unknown[],
  ) {
    const result = await this.client.query(
      `
      INSERT INTO Font_family
        (
          Name,
          Year_created,
          Description,
          Typeface_count,
          id_Category
        )
      VALUES
        ${placeholders.join(", ")}
      RETURNING id_Font_family
      `,
      values,
    );

    for (const row of result.rows) {
      this.fontFamilyIds.push(row.id_font_family);
    }
  }

  private async seedTypefaces() {
    let created = 0;

    const batchSize = 1000;
    let values: unknown[] = [];
    let placeholders: string[] = [];

    for (const fontFamilyId of this.fontFamilyIds) {
      const familyName = this.makeTypefaceFamilyPrefix(fontFamilyId);

      for (let i = 0; i < COEFFICIENTS.typefacesPerFamily; i++) {
        const weight = weights[i % weights.length];
        const slope = slopes[i % slopes.length];

        const weightId = this.getRequiredId(this.weightIds, weight, "Weight");
        const slopeId = this.getRequiredId(this.slopeIds, slope, "Slope");

        const formatId = this.formatIds[i % this.formatIds.length];

        const typefaceName =
          slope === "Upright"
            ? `${familyName} ${weight}`
            : `${familyName} ${weight} ${slope}`;

        const index = values.length;

        placeholders.push(
          `($${index + 1}, $${index + 2}, $${index + 3}, $${index + 4}, $${index + 5}, $${index + 6})`,
        );

        values.push(
          typefaceName.slice(0, 100),
          weightId,
          slopeId,
          faker.number.int({ min: 30_000, max: 400_000 }),
          fontFamilyId,
          formatId,
        );

        created++;

        if (placeholders.length >= batchSize) {
          await this.insertTypefaceBatch(placeholders, values);
          values = [];
          placeholders = [];

          if (created % 5000 === 0) {
            console.log(`  Typeface: ${created}/${COUNTS.typefaces}`);
          }
        }
      }
    }

    if (placeholders.length > 0) {
      await this.insertTypefaceBatch(placeholders, values);
    }

    console.log(`Typeface: ${this.typefaces.length}`);
  }

  private async insertTypefaceBatch(placeholders: string[], values: unknown[]) {
    const result = await this.client.query(
      `
      INSERT INTO Typeface
        (
          Name,
          id_Weight,
          id_Slope,
          File_size,
          id_Font_family,
          id_Format
        )
      VALUES
        ${placeholders.join(", ")}
      RETURNING id_Typeface, id_Font_family
      `,
      values,
    );

    for (const row of result.rows) {
      this.typefaces.push({
        id: row.id_typeface,
        fontFamilyId: row.id_font_family,
      });
    }
  }

  private async seedAlphabets() {
    let created = 0;

    const alphabetPairs = this.buildAlphabetPairs();

    const batchSize = 5000;
    let values: unknown[] = [];
    let placeholders: string[] = [];

    for (const [typefaceId, languageId] of alphabetPairs) {
      const index = values.length;

      placeholders.push(
        `($${index + 1}, $${index + 2}, $${index + 3}, $${index + 4}, $${index + 5}, $${index + 6})`,
      );

      values.push(
        0,
        0,
        this.makeVerificationDate(),
        this.makeAlphabetStatus(),
        typefaceId,
        languageId,
      );

      created++;

      if (placeholders.length >= batchSize) {
        await this.insertAlphabetBatch(placeholders, values);
        values = [];
        placeholders = [];

        if (created % 50_000 === 0) {
          console.log(`  Alphabet: ${created}/${alphabetPairs.length}`);
        }
      }
    }

    if (placeholders.length > 0) {
      await this.insertAlphabetBatch(placeholders, values);
    }

    console.log(`Alphabet: ${created}`);
  }

  private buildAlphabetPairs(): Array<[number, number]> {
    const languagesPerTypeface = COEFFICIENTS.alphabetsPerTypeface;
    const typefacesPerLanguage = COEFFICIENTS.alphabetsPerLanguage;

    if (this.typefaces.length === 0) {
      throw new Error("Cannot seed Alphabet: no typefaces");
    }

    if (this.languageIds.length === 0) {
      throw new Error("Cannot seed Alphabet: no languages");
    }

    if (languagesPerTypeface > this.languageIds.length) {
      throw new Error(
        `Cannot seed Alphabet: alphabetsPerTypeface=${languagesPerTypeface}, but languages=${this.languageIds.length}`,
      );
    }

    if (typefacesPerLanguage > this.typefaces.length) {
      throw new Error(
        `Cannot seed Alphabet: alphabetsPerLanguage=${typefacesPerLanguage}, but typefaces=${this.typefaces.length}`,
      );
    }

    const totalAlphabetRows =
      this.typefaces.length * languagesPerTypeface +
      this.languageIds.length * typefacesPerLanguage;

    if (totalAlphabetRows !== COUNTS.alphabets) {
      console.warn(
        `Alphabet target mismatch: generated ${totalAlphabetRows}, constants contain ${COUNTS.alphabets}`,
      );
    }

    if (totalAlphabetRows > this.typefaces.length * this.languageIds.length) {
      throw new Error(
        `Cannot seed Alphabet: requested ${totalAlphabetRows} unique pairs, but maximum is ${
          this.typefaces.length * this.languageIds.length
        }`,
      );
    }

    const pairs: Array<[number, number]> = [];
    const usedPairs = new Set<string>();

    const addPair = (typefaceId: number, languageId: number) => {
      const key = `${typefaceId}:${languageId}`;

      if (usedPairs.has(key)) {
        throw new Error(
          `Cannot seed Alphabet: duplicated pair typeface=${typefaceId}, language=${languageId}`,
        );
      }

      usedPairs.add(key);
      pairs.push([typefaceId, languageId]);
    };

    for (
      let typefaceIndex = 0;
      typefaceIndex < this.typefaces.length;
      typefaceIndex++
    ) {
      const typeface = this.typefaces[typefaceIndex];

      for (let offset = 0; offset < languagesPerTypeface; offset++) {
        const languageIndex =
          (typefaceIndex + offset) % this.languageIds.length;

        const languageId = this.languageIds[languageIndex];

        addPair(typeface.id, languageId);
      }
    }

    for (
      let languageIndex = 0;
      languageIndex < this.languageIds.length;
      languageIndex++
    ) {
      const languageId = this.languageIds[languageIndex];
      const availableTypefaces = this.typefaces.filter(
        (typeface) => !usedPairs.has(`${typeface.id}:${languageId}`),
      );

      if (typefacesPerLanguage > availableTypefaces.length) {
        throw new Error(
          `Cannot seed Alphabet: language ${languageId} has only ${availableTypefaces.length} available typefaces`,
        );
      }

      for (let offset = 0; offset < typefacesPerLanguage; offset++) {
        const typefaceIndex =
          (languageIndex + offset) % availableTypefaces.length;
        const typeface = availableTypefaces[typefaceIndex];

        addPair(typeface.id, languageId);
      }
    }

    if (pairs.length !== totalAlphabetRows) {
      throw new Error(
        `Cannot seed Alphabet: created ${pairs.length}/${totalAlphabetRows} rows`,
      );
    }

    return pairs;
  }

  private async insertAlphabetBatch(placeholders: string[], values: unknown[]) {
    await this.client.query(
      `
      INSERT INTO Alphabet
        (
          Typeface_count_in_system,
          Supported_family_count,
          Verification_date,
          Status,
          id_Typeface,
          id_Language
        )
      VALUES
        ${placeholders.join(", ")}
      `,
      values,
    );
  }

  private async updateAlphabetCounts() {
    await this.client.query(`
      UPDATE Alphabet a
      SET
        Typeface_count_in_system = stats.typeface_count,
        Supported_family_count = stats.family_count
      FROM (
        SELECT
          a2.id_Language,
          COUNT(DISTINCT a2.id_Typeface) AS typeface_count,
          COUNT(DISTINCT t.id_Font_family) AS family_count
        FROM Alphabet a2
        JOIN Typeface t ON t.id_Typeface = a2.id_Typeface
        GROUP BY a2.id_Language
      ) stats
      WHERE stats.id_Language = a.id_Language
    `);

    console.log("Alphabet counts updated");
  }

  private async updateCategoryCounts() {
    await this.client.query(`
      UPDATE Category
      SET Font_family_count = (
        SELECT COUNT(*)
        FROM Font_family
        WHERE Font_family.id_Category = Category.id_Category
      )
    `);

    console.log("Category counts updated");
  }

  private makeFontFamilyName(index: number): string {
    const adjective = faker.word.adjective();
    const noun = faker.word.noun();

    const generated = `${adjective} ${noun}`
      .split(" ")
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" ");

    return `${generated} ${index + 1}`.slice(0, 100);
  }

  private makeTypefaceFamilyPrefix(fontFamilyId: number): string {
    return `Family ${fontFamilyId}`;
  }

  private makeVerificationDate(): string | null {
    return (
      faker.helpers.maybe(
        () => faker.date.past({ years: 2 }).toISOString().split("T")[0],
        { probability: 0.7 },
      ) ?? null
    );
  }

  private makeAlphabetStatus(): string {
    return faker.helpers.arrayElement(alphabetStatuses);
  }

  private getRequiredId(map: IdMap, key: string, tableName: string): number {
    const id = map.get(key);

    if (id === undefined) {
      throw new Error(`Missing dictionary value in ${tableName}: ${key}`);
    }

    return id;
  }

  private slugify(value: string): string {
    return value.toLowerCase().replaceAll(" ", "-").replaceAll("_", "-");
  }

  private async printSummary() {
    let total = 0;

    console.log("\nTable counts:");

    for (const table of tables) {
      const result = await pool.query(`SELECT COUNT(*) FROM ${table}`);
      const count = Number(result.rows[0].count);

      total += count;
      console.log(`  ${table}: ${count}`);
    }

    console.log(`  TOTAL: ${total}`);
  }
}

new Seeder().run().catch((error) => {
  console.error(error);
  process.exit(1);
});
