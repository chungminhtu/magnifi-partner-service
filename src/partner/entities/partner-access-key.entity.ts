import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, Index } from "typeorm";

@Entity()
export class PartnerAccessKey {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "varchar", length: 255, unique: true })
  @Index()
  key_id: string;

  @Column({ type: "varchar", length: 255, nullable: false })
  entity_id: string;

  @Column({ type: "varchar", length: 255, nullable: false })
  user_id: string;

  @Column({ type: "varchar", length: 255, nullable: false })
  organization_member_id: string;

  @Column({ type: "text", nullable: false })
  key_secret_hash: string;

  @Column({ type: "varchar", length: 255, nullable: true })
  name: string;

  @Column({ type: "boolean", default: true })
  is_active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
