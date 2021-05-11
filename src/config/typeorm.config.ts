import { TypeOrmModuleOptions } from "@nestjs/typeorm";

export const typeOrmConfig: TypeOrmModuleOptions = {
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: '89fastday*',
    database: 'daytechstagram',
    autoLoadEntities: true,
    synchronize: true,
}