import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User, UserRole } from '../modules/user/user.entity';
import { Category } from '../modules/category/category.entity';
import { Product, ProductStatus } from '../modules/product/product.entity';
import * as bcrypt from 'bcrypt';

const dataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASS || '123456',
  database: process.env.DB_NAME || 'ecommerce',
  entities: [User, Category, Product],
  synchronize: true,
});

// ─── Users ────────────────────────────────────────────────────────────────────

const USERS = [
  { name: 'Admin', email: 'admin@example.com', password: 'Admin@123', role: UserRole.ADMIN },
  { name: 'Người dùng', email: 'user@example.com', password: 'User@123', role: UserRole.USER },
];

// ─── Categories ───────────────────────────────────────────────────────────────

const CATEGORIES = [
  {
    name: 'Điện thoại & Phụ kiện',
    slug: 'dien-thoai-phu-kien',
    description: 'Điện thoại thông minh, tai nghe, ốp lưng và phụ kiện di động',
  },
  {
    name: 'Laptop & Máy tính',
    slug: 'laptop-may-tinh',
    description: 'Laptop, máy tính bàn, bàn phím, chuột và thiết bị ngoại vi',
  },
  {
    name: 'Thời trang Nam',
    slug: 'thoi-trang-nam',
    description: 'Áo, quần, giày dép và phụ kiện thời trang dành cho nam',
  },
  {
    name: 'Thời trang Nữ',
    slug: 'thoi-trang-nu',
    description: 'Áo, váy, đầm, túi xách và phụ kiện thời trang dành cho nữ',
  },
  {
    name: 'Đồ gia dụng',
    slug: 'do-gia-dung',
    description: 'Thiết bị nhà bếp, đồ dùng sinh hoạt và nội thất gia đình',
  },
];

// ─── Products ─────────────────────────────────────────────────────────────────

const PRODUCTS = (cats: Record<string, Category>): Partial<Product>[] => [
  // Điện thoại & Phụ kiện
  {
    name: 'iPhone 15 Pro Max 256GB',
    slug: 'iphone-15-pro-max-256gb',
    description: 'Chip A17 Pro, màn hình Super Retina XDR 6.7", camera 48MP, khung titan cao cấp.',
    sku: 'DT-IP15PM-001',
    price: '34990000',
    salePrice: '31990000',
    stock: 50,
    status: ProductStatus.ACTIVE,
    imageUrl: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=600&q=80',
    category: cats['dien-thoai-phu-kien'],
  },
  {
    name: 'Samsung Galaxy S24 Ultra 256GB',
    slug: 'samsung-galaxy-s24-ultra-256gb',
    description: 'Bút S Pen tích hợp, camera 200MP, chip Snapdragon 8 Gen 3, pin 5000mAh.',
    sku: 'DT-S24U-002',
    price: '28990000',
    salePrice: '25990000',
    stock: 40,
    status: ProductStatus.ACTIVE,
    imageUrl: 'https://images.unsplash.com/photo-1707234468883-f560817a1c01?w=600&q=80',
    category: cats['dien-thoai-phu-kien'],
  },
  {
    name: 'Tai nghe Sony WH-1000XM5',
    slug: 'tai-nghe-sony-wh-1000xm5',
    description: 'Chống ồn chủ động hàng đầu, âm thanh Hi-Res, pin 30 giờ, kết nối Bluetooth 5.2.',
    sku: 'DT-SONY-003',
    price: '7990000',
    salePrice: '6490000',
    stock: 100,
    status: ProductStatus.ACTIVE,
    imageUrl: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600&q=80',
    category: cats['dien-thoai-phu-kien'],
  },

  // Laptop & Máy tính
  {
    name: 'MacBook Air M3 13 inch 8GB/256GB',
    slug: 'macbook-air-m3-13-inch',
    description: 'Chip Apple M3, màn hình Liquid Retina 13.6", pin 18 giờ, thiết kế siêu mỏng nhẹ.',
    sku: 'LT-MBA-M3-001',
    price: '28990000',
    salePrice: '26990000',
    stock: 30,
    status: ProductStatus.ACTIVE,
    imageUrl: 'https://images.unsplash.com/photo-1611186871525-89fb60e83b7a?w=600&q=80',
    category: cats['laptop-may-tinh'],
  },
  {
    name: 'Laptop ASUS VivoBook 15 OLED',
    slug: 'asus-vivobook-15-oled',
    description: 'Core i5-13500H, RAM 16GB, SSD 512GB, màn hình OLED 15.6" Full HD 60Hz.',
    sku: 'LT-ASUS-VB15-002',
    price: '15990000',
    salePrice: '13490000',
    stock: 60,
    status: ProductStatus.ACTIVE,
    imageUrl: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=600&q=80',
    category: cats['laptop-may-tinh'],
  },
  {
    name: 'Chuột không dây Logitech MX Master 3S',
    slug: 'chuot-logitech-mx-master-3s',
    description: 'Cảm biến 8000 DPI, kết nối Bluetooth & USB, cuộn MagSpeed, pin 70 ngày.',
    sku: 'LT-LOGI-MX3S-003',
    price: '1990000',
    salePrice: '1690000',
    stock: 200,
    status: ProductStatus.ACTIVE,
    imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=600&q=80',
    category: cats['laptop-may-tinh'],
  },

  // Thời trang Nam
  {
    name: 'Áo Polo Nam Cotton Piqué Cao Cấp',
    slug: 'ao-polo-nam-cotton-pique',
    description: 'Chất liệu cotton piqué 100%, cổ bẻ, thoáng mát, phù hợp đi làm và dạo phố.',
    sku: 'TN-POLO-001',
    price: '450000',
    salePrice: '350000',
    stock: 150,
    status: ProductStatus.ACTIVE,
    imageUrl: 'https://images.unsplash.com/photo-1586363104862-3a5e2ab60d99?w=600&q=80',
    category: cats['thoi-trang-nam'],
  },
  {
    name: 'Quần Jean Slim Fit Nam',
    slug: 'quan-jean-slim-fit-nam',
    description: 'Vải denim co giãn 4 chiều, form slim vừa vặn, màu xanh đậm thời thượng.',
    sku: 'TN-JEAN-002',
    price: '690000',
    stock: 120,
    status: ProductStatus.ACTIVE,
    imageUrl: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=600&q=80',
    category: cats['thoi-trang-nam'],
  },
  {
    name: 'Giày Thể Thao Nam Nike Air Max 270',
    slug: 'giay-nike-air-max-270-nam',
    description: 'Đệm Air Max 270 đàn hồi tối đa, upper mesh thoáng khí, đế cao su chịu mài mòn.',
    sku: 'TN-NIKE-270-003',
    price: '2890000',
    salePrice: '2390000',
    stock: 80,
    status: ProductStatus.ACTIVE,
    imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=80',
    category: cats['thoi-trang-nam'],
  },

  // Thời trang Nữ
  {
    name: 'Áo Sơ Mi Nữ Vải Linen Nhẹ',
    slug: 'ao-so-mi-nu-vai-linen',
    description: 'Chất linen tự nhiên cao cấp, thoáng mát, dễ phối đồ, màu trắng ngà thanh lịch.',
    sku: 'TNU-LINEN-001',
    price: '390000',
    salePrice: '290000',
    stock: 200,
    status: ProductStatus.ACTIVE,
    imageUrl: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600&q=80',
    category: cats['thoi-trang-nu'],
  },
  {
    name: 'Váy Maxi Hoa Nhí Dáng Xòe',
    slug: 'vay-maxi-hoa-nhi-dang-xoe',
    description: 'Chất voan mềm mại, họa tiết hoa nhí nhẹ nhàng, dài qua gối, phù hợp dạo phố.',
    sku: 'TNU-MAXI-002',
    price: '590000',
    stock: 100,
    status: ProductStatus.ACTIVE,
    imageUrl: 'https://images.unsplash.com/photo-1572804013427-4d7ca7268217?w=600&q=80',
    category: cats['thoi-trang-nu'],
  },
  {
    name: 'Túi Xách Nữ Da PU Cao Cấp',
    slug: 'tui-xach-nu-da-pu',
    description: 'Da PU mềm mịn, khóa kéo chắc chắn, ngăn chính rộng, dây đeo điều chỉnh được.',
    sku: 'TNU-BAG-003',
    price: '890000',
    salePrice: '690000',
    stock: 60,
    status: ProductStatus.ACTIVE,
    imageUrl: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&q=80',
    category: cats['thoi-trang-nu'],
  },

  // Đồ gia dụng
  {
    name: 'Nồi Cơm Điện Panasonic 1.8L SR-TEG18',
    slug: 'noi-com-dien-panasonic-1-8l',
    description: 'Dung tích 1.8L nấu được 10 chén cơm, lòng nồi chống dính, giữ ấm tự động.',
    sku: 'GD-PANA-NCĐ-001',
    price: '1290000',
    salePrice: '990000',
    stock: 80,
    status: ProductStatus.ACTIVE,
    imageUrl: 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=600&q=80',
    category: cats['do-gia-dung'],
  },
  {
    name: 'Máy Xay Sinh Tố Philips HR2041',
    slug: 'may-xay-sinh-to-philips-hr2041',
    description: 'Công suất 400W, cối thủy tinh 1.5L chịu nhiệt, 2 tốc độ xay, dễ vệ sinh.',
    sku: 'GD-PHILIPS-MX-002',
    price: '890000',
    stock: 120,
    status: ProductStatus.ACTIVE,
    imageUrl: 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?w=600&q=80',
    category: cats['do-gia-dung'],
  },
  {
    name: 'Bộ Chăn Ga Gối Cotton 4 Món',
    slug: 'bo-chan-ga-goi-cotton-4-mon',
    description: 'Cotton 100% sợi OE mềm mịn, kích thước 1m8 x 2m, họa tiết kẻ sọc Scandinavian.',
    sku: 'GD-CHAN-GA-003',
    price: '990000',
    salePrice: '750000',
    stock: 150,
    status: ProductStatus.ACTIVE,
    imageUrl: 'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80',
    category: cats['do-gia-dung'],
  },
];

// ─── Main ─────────────────────────────────────────────────────────────────────

async function seed() {
  await dataSource.initialize();

  const userRepo = dataSource.getRepository(User);
  const categoryRepo = dataSource.getRepository(Category);
  const productRepo = dataSource.getRepository(Product);

  // Users
  console.log('\n[seed] ── Users ──');
  for (const u of USERS) {
    const exists = await userRepo.findOneBy({ email: u.email });
    if (exists) { console.log(`  skip: ${u.email}`); continue; }
    const hashed = await bcrypt.hash(u.password, 10);
    await userRepo.save(userRepo.create({ ...u, password: hashed }));
    console.log(`  created ${u.role}: ${u.email}  /  ${u.password}`);
  }

  // Categories
  console.log('\n[seed] ── Categories ──');
  const savedCats: Record<string, Category> = {};
  for (const c of CATEGORIES) {
    let cat = await categoryRepo.findOneBy({ slug: c.slug });
    if (!cat) {
      cat = await categoryRepo.save(categoryRepo.create(c));
      console.log(`  created: ${c.name}`);
    } else {
      console.log(`  skip: ${c.name}`);
    }
    savedCats[c.slug] = cat;
  }

  // Products
  console.log('\n[seed] ── Products ──');
  for (const p of PRODUCTS(savedCats)) {
    const exists = await productRepo.findOneBy({ sku: p.sku });
    if (exists) { console.log(`  skip: ${p.name}`); continue; }
    await productRepo.save(productRepo.create(p));
    console.log(`  created: ${p.name}`);
  }

  await dataSource.destroy();
  console.log('\n[seed] done ✓');
}

seed().catch((err) => {
  console.error('[seed] failed:', err);
  process.exit(1);
});
