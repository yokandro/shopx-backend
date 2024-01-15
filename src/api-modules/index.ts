import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { AccountsModule } from './accounts/accounts.module';
import { UsersModule } from './users/users.module';

export default [AccountsModule, AuthModule, CategoryModule, ProductsModule, UsersModule];
