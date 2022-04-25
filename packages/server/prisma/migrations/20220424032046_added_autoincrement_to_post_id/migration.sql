-- AlterTable
CREATE SEQUENCE "post_id_seq";
ALTER TABLE "Post" ALTER COLUMN "id" SET DEFAULT nextval('post_id_seq');
ALTER SEQUENCE "post_id_seq" OWNED BY "Post"."id";

-- AlterTable
ALTER TABLE "Team" ALTER COLUMN "set" SET DEFAULT floor(random() * 5 + 1)::int;
