import { Role } from "../../common/enums/role.enum";
import { Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

/** esta entidad es como se va comportar este usuario en la bd, que propiedades y valores va tener */
@Entity()
export class User {

    // @Column({ primary: true, generated: true })
    @PrimaryGeneratedColumn()
    idUser: number;

    @Column({ length: 60 })
    name: string;

    /** ES UNICO Y NO PUEDE SER NULO */
    @Column({ unique: true, nullable: false })
    email: string;

    @Column({ nullable: false, select: false })
    password: string;

    @Column({ nullable: false})
    secretWord: string;

    @Column()
    imageFile: string;

    @Column({ type: 'enum', default: Role.USER, enum: Role })
    role: Role;

    @DeleteDateColumn()
    deletedAt: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}