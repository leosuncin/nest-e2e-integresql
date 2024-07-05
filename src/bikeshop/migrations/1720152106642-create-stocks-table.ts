import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateStocksTable implements MigrationInterface {
  name = 'CreateStocksTable1720152106642';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/* sql */ `CREATE TABLE "stocks" (
      "product_id" bigint NOT NULL,
      "store_id" bigint NOT NULL,
      "quantity" integer NOT NULL DEFAULT 0,
      CONSTRAINT "CHK_27fc179deca6a051489c772f9d" CHECK ("quantity" >= 0),
      CONSTRAINT "PK_402d902c3b3df6b4e8bb33de1ac" PRIMARY KEY ("product_id", "store_id")
    )`);
    await queryRunner.query(/* sql */ `ALTER TABLE "stocks"
      ADD CONSTRAINT "FK_cdcdc9a4b531cbd24c06bc4f9e7"
        FOREIGN KEY ("product_id")
        REFERENCES "products"("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE`);
    await queryRunner.query(/* sql */ `ALTER TABLE "stocks"
      ADD CONSTRAINT "FK_6fdcbba5cc8a62ae295a45a6356"
        FOREIGN KEY ("store_id")
        REFERENCES "stores"("id")
          ON DELETE CASCADE
          ON UPDATE CASCADE`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/* sql */ `ALTER TABLE "stocks"
      DROP CONSTRAINT "FK_6fdcbba5cc8a62ae295a45a6356"`);
    await queryRunner.query(/* sql */ `ALTER TABLE "stocks"
      DROP CONSTRAINT "FK_cdcdc9a4b531cbd24c06bc4f9e7"`);
    await queryRunner.query(/* sql */ `DROP TABLE "stocks"`);
  }
}
