import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateBrandsTable implements MigrationInterface {
  name = 'CreateBrandsTable1718954984063';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/* sql */ `CREATE TABLE "brands" (
      "id" bigint GENERATED BY DEFAULT AS IDENTITY NOT NULL,
      "name" character varying NOT NULL,
      CONSTRAINT "PK_b0c437120b624da1034a81fc561" PRIMARY KEY ("id")
    )`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(/* sql */ `DROP TABLE "brands"`);
  }
}
