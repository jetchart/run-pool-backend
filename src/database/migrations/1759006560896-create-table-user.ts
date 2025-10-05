import type { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTableUser1759006560896 implements MigrationInterface {
  name = 'CreateTableUser1759006560896';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "user" (
                "id" SERIAL NOT NULL,
                "name" character varying(255) NOT NULL,
                "given_name" character varying(255) NOT NULL,
                "family_name" character varying(255) NOT NULL,
                "picture_url" character varying(255) NOT NULL,
                "email" character varying(255) NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "deletedAt" TIMESTAMP,
                CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"),
                CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE "user"
        `);
  }
}
