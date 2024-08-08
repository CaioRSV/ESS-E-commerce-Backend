import { RoleEnum, StatusEnum, PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

export const ADMIN_EMAIL = 'admin@gmail.com';
export const ADMIN_PASSWORD = 'admin';

export const TEST_USER_NAME = 'Teste';
export const TEST_USER_EMAIL = 'teste@gmail.com';
export const TEST_USER_PASSWORD = '@Teste123';

const prisma = new PrismaClient();

const seedUser = async (prisma: PrismaClient): Promise<void> => {
  console.log('Seeding user');

  const alreadyHasAdminUser =
    (await prisma.user.count({
      where: {
        role: RoleEnum.ADMIN,
      },
    })) > 0;

  if (!alreadyHasAdminUser) {
    console.log('Creating admin user');

    await prisma.user.create({
      data: {
        email: ADMIN_EMAIL,
        name: 'Admin User',
        Media: {
          create: {
            url: 'https://example.com/image.jpg',
          },
        },
        password: await bcrypt.hash(ADMIN_PASSWORD, 10),
        status: StatusEnum.ACTIVE,
        recoveryPasswordToken: null,
        refreshToken: null,
        deletedAt: null,
        role: RoleEnum.ADMIN,
      },
    });

    const AdminUser = await prisma.user.findFirst({
      where: {
        name: 'Admin User',
      },
    });

    await prisma.cart.create({
      data: {
        userId: AdminUser.id,
        locked: false,
      },
    });
  }
};

const seedCustomer = async (prisma: PrismaClient): Promise<void> => {
  console.log('Seeding Test Customer');

  const alreadyHasCustomer =
    (await prisma.user.count({
      where: {
        role: RoleEnum.CUSTOMER,
      },
    })) > 0;

  if (!alreadyHasCustomer) {
    console.log('Creating customer user');

    await prisma.user.create({
      data: {
        email: TEST_USER_EMAIL,
        name: TEST_USER_NAME,
        Media: {
          create: {
            url: 'https://example.com/image.jpg',
          },
        },
        password: await bcrypt.hash(TEST_USER_PASSWORD, 10),
        status: StatusEnum.ACTIVE,
        recoveryPasswordToken: null,
        refreshToken: null,
        deletedAt: null,
        role: RoleEnum.CUSTOMER,
      },
    });

    // Utils Carrinho & Histórico de Pedidos

    const TestUser = await prisma.user.findFirst({
      where: {
        name: 'Teste',
      },
    });

    console.log('Seeding Tênis category');

    await prisma.category.create({
      data: {
        name: 'Tênis',
        Media: {
          create: {
            url: "https://cdn-icons-png.flaticon.com/512/500/500225.png"
          }
        }
      },
    });

    const TenisCategory = await prisma.category.findUnique({
      where: {
        name: 'Tênis',
      },
    });

    console.log('Seeding Produto A product');

    await prisma.product.create({
      data: {
        name: 'Produto A',
        price: 50.5,
        stock: 50,
        categoryId: TenisCategory.id,
        description: 'Produto A description'
      },
    });

    const newProduct = await prisma.product.findFirst({
      where: {
        name: 'Produto A',
      },
    });

    const newMedia = await prisma.media.create({
      data: {
        url: "https://i.pinimg.com/564x/fb/a9/d6/fba9d6e3f87a56403d204c6e99c605b0.jpg"
      }
    })

    await prisma.productMedia.create({
      data: {
        productId: newProduct.id,
        mediaId: newMedia.id
      }
    })

    console.log('Seeding Test User cart');

    await prisma.cart.create({
      data: {
        userId: TestUser.id,
        locked: false,
      },
    });

    const newCart = await prisma.cart.findUnique({
      where: {
        userId: TestUser.id,
      },
    });

    await prisma.cartProduct.create({
      data: {
        cartId: newCart.id,
        productId: newProduct.id,
        userId: TestUser.id,
        quantity: 1,
      },
    });

    console.log('Seeding Test User sample order');

    await prisma.order.create({
      data: {
        code: '#testOrder#123',
        price: 50.5,
        userId: TestUser.id,
        estimatedDelivery: new Date('2024-08-01T00:00:00Z'), // Data de entrega estimada
      },
    });

    const newOrder = await prisma.order.findUnique({
      where: {
        code: '#testOrder#123',
      },
    });

    await prisma.orderProduct.create({
      data: {
        orderId: newOrder.id,
        productId: newProduct.id,
        quantity: 1,
      },
    });

    // Fazendo seed de itens não necessários para testes, mas úteis para visualização geral do projeto em setup

    console.log('Seeding other products');

    await prisma.category.create({
      data: {
        name: 'Sapatos',
        Media: {
          create: {
            url: "https://i.imgur.com/Qo3e2D6.png"
          }
        }
      },
    });

    const SapatosCategory = await prisma.category.findUnique({
      where: {
        name: 'Sapatos',
      },
    });

    await prisma.product.create({
      data: {
        name: 'Sapato Masculino - Preto',
        price: 334,
        stock: 50,
        categoryId: SapatosCategory.id,
        description: 'Sapato masculino social, linha conforto - 1709 Preto'
      },
    });

    const sapatoMasculino = await prisma.product.findFirst({
      where: {
        name: 'Sapato Masculino - Preto',
      },
    });

    const SM_Media = await prisma.media.create({
      data: {
        url: "https://cdn.shoppub.io/cdn-cgi/image/w=1000,h=1000,q=80,f=auto/difranca/media/uploads/produtos/foto/hxuuhwaz/sapato-masculino-linha-conforto-de-pelica-asa-calcados-1709-preto-par-de-frente-e-de-lado.jpg"
      }
    })

    await prisma.productMedia.create({
      data: {
        productId: sapatoMasculino.id,
        mediaId: SM_Media.id
      }
    })

    //

    await prisma.product.create({
      data: {
        name: 'Sapato Feminino Mocassim',
        price: 187,
        stock: 50,
        categoryId: SapatosCategory.id,
        description: 'Sapato feminino Mocassim tratorado'
      },
    });

    const sapatoFeminino = await prisma.product.findFirst({
      where: {
        name: 'Sapato Feminino Mocassim',
      },
    });

    const SF_Media = await prisma.media.create({
      data: {
        url: "https://cdn.shoppub.io/cdn-cgi/image/w=1000,h=1000,q=80,f=auto/sandromoscoloni/media/uploads/produtos/foto/iuimcdcg/file.png"
      }
    })

    await prisma.productMedia.create({
      data: {
        productId: sapatoFeminino.id,
        mediaId: SF_Media.id
      }
    })


  }
};

(async () => {
  await seedUser(prisma);
  await seedCustomer(prisma);
})();
