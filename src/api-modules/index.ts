import { AuthModule } from './auth/auth.module';
import { CategoryModule } from './categories/categories.module';
import { ProductsModule } from './products/products.module';
import { AccountsModule } from './users/accounts/accounts.module';

export default [AccountsModule, AuthModule, CategoryModule, ProductsModule];
