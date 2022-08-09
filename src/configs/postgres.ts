import { SequelizeModule } from "@nestjs/sequelize";

import { User } from "../users/users.model";


export default SequelizeModule.forRoot({
  autoLoadModels: true,
  dialect: "postgres",
  host: process.env.PG_HOST,
  port: Number(process.env.PG_PORT),
  username: process.env.PG_USER,
  password: process.env.PG_PASS,
  database: process.env.PG_DB,
  models: [
    User,
  ],
});
