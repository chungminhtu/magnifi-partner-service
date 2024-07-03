import { MigrationInterface, QueryRunner } from "typeorm";

export class File1719985761658 implements MigrationInterface {
    name = 'File1719985761658'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "partner_access_key" ("id" SERIAL NOT NULL, "key_id" character varying(255) NOT NULL, "entity_id" character varying(255) NOT NULL, "user_id" character varying(255) NOT NULL, "organization_member_id" character varying(255) NOT NULL, "key_secret_hash" text NOT NULL, "name" character varying(255), "is_active" boolean NOT NULL DEFAULT true, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_6bd25f8074f763988e119a9d38c" UNIQUE ("key_id"), CONSTRAINT "PK_fe9c3018cc2847bcd700e988c60" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_6bd25f8074f763988e119a9d38" ON "partner_access_key" ("key_id") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_6bd25f8074f763988e119a9d38"`);
        await queryRunner.query(`DROP TABLE "partner_access_key"`);
    }

}
