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
    @DeleteDateColumn()
    deleted_at: Date;
}
