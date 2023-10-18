import { Exclude } from 'class-transformer';
import {
    CreateDateColumn,
    DeleteDateColumn,
    PrimaryGeneratedColumn,
    BaseEntity as TypeormBaseEntity,
    UpdateDateColumn,
} from 'typeorm';

export class BaseEntity extends TypeormBaseEntity {
    @PrimaryGeneratedColumn()
    id: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}

export class BaseWithDeletedEntity extends BaseEntity {
    @Exclude()
    @DeleteDateColumn()
    deleted_at: Date;
}
