const { assert } = require('chai');

describe('Общие требования', async function () {
    it('При ширине меньше 576px появляется burger меню', async function () {
        await this.browser.url('http://localhost:3000/hw/store');
        await this.browser.setWindowSize(575, 500);
        const burger = await this.browser.$(".Application-Toggler");
        assert(await burger.isDisplayed());
    });

    it("Название магазина в шапке должно быть ссылкой на главную страницу", async function () {
        await this.browser.url('http://localhost:3000/hw/store');
        const header = await this.browser.$(".navbar");
        const link = await header.$(".Application-Brand");
        assert(await link.isExisting());
        assert.equal(await link.getText(), "Example store");
        assert.equal(await link.getAttribute("href"), "/hw/store/");
    });

    it("В шапке отображаются ссылки на страницы магазина, а также ссылка на корзину", async function () {
        await this.browser.url('http://localhost:3000/hw/store');
        const header = await this.browser.$(".navbar");

        const linkCatalog = await header.$('=Catalog');
        assert(await linkCatalog.isExisting());
        const linkCatalogHref = await linkCatalog.getAttribute('href');
        assert.equal(await linkCatalogHref, "/hw/store/catalog");

        const linkDelivery = await header.$('=Delivery');
        assert(await linkDelivery.isExisting());
        const linkDeliveryHref = await linkDelivery.getAttribute('href');
        assert.equal(await linkDeliveryHref, "/hw/store/delivery");

        const linkContacts = await header.$('=Contacts');
        assert(await linkContacts.isExisting());
        const linkContactsHref = await linkContacts.getAttribute('href');
        assert.equal(await linkContactsHref, "/hw/store/contacts");

        const linkCart = await header.$('=Cart');
        assert(await linkCart.isExisting());
        const linkCartHref = await linkCart.getAttribute('href');
        assert.equal(await linkCartHref, "/hw/store/cart");
    });

    it("при выборе элемента из меню гамбургера, меню должно закрываться", async function () {
        await this.browser.url('http://localhost:3000/hw/store');
        await this.browser.setWindowSize(575, 500);
        const burger = await this.browser.$(".Application-Toggler");
        const menu = await this.browser.$(".Application-Menu");

        assert.equal(await menu.isDisplayed(), false);

        await burger.click();

        assert.equal(await menu.isDisplayed(), true);

        const link = await menu.$(".nav-link");

        await link.click();

        assert.equal(await menu.isDisplayed(), false);
    });
});



describe('Страницы', async function () {
    it('В магазине должна быть страница: Главная', async function () {
        await this.browser.url('http://localhost:3000/hw/store');

        const page = await this.browser.$(".Home");
        assert(await page.isExisting());
    });

    it('В магазине должна быть страница: Каталог', async function () {
        await this.browser.url('http://localhost:3000/hw/store/catalog');

        const page = await this.browser.$(".Catalog");
        assert(await page.isExisting());
    });

    it('В магазине должна быть страница: Доставка', async function () {
        await this.browser.url('http://localhost:3000/hw/store/delivery');

        const page = await this.browser.$(".Delivery");
        assert(await page.isExisting());
    });

    it('В магазине должна быть страница: Контакты', async function () {
        await this.browser.url('http://localhost:3000/hw/store/contacts');

        const page = await this.browser.$(".Contacts");
        assert(await page.isExisting());
    });
});

describe('Каталог', async function () {
    it('Если товар уже добавлен в корзину, в каталоге и на странице товара должно отображаться сообщение об этом', async function () {
        await this.browser.url('http://localhost:3000/hw/store/catalog');

        const item = await this.browser.$(".ProductItem");
        const itemLink = await item.$(".ProductItem-DetailsLink");

        await itemLink.click();

        const addToCartButton = await this.browser.$(".ProductDetails-AddToCart");

        await addToCartButton.click();

        const alreadyBuyMessageInDetails = await this.browser.$(".CartBadge");

        assert(await alreadyBuyMessageInDetails.isExisting());
        assert(await alreadyBuyMessageInDetails.getText(), "Item in cart");

        const catalogLink = await this.browser.$(".Application-Menu").$(".active");

        await catalogLink.click();

        const alreadyBuyMessageInCatalog = await item.$(".CartBadge");

        assert(await alreadyBuyMessageInCatalog.isExisting());
        assert(await alreadyBuyMessageInCatalog.getText(), "Item in cart");
    });

    it('Если товар уже добавлен в корзину, повторное нажатие кнопки "добавить в корзину" должно увеличивать его количество', async function () {
        await this.browser.url('http://localhost:3000/hw/store/catalog');

        const item = await this.browser.$(".ProductItem");
        const itemLink = await item.$(".ProductItem-DetailsLink");

        await itemLink.click();

        const addToCartButton = await this.browser.$(".ProductDetails-AddToCart");

        await addToCartButton.click();

        const cartLink = await this.browser.$(".Application-Menu").$("=Cart (1)");

        await cartLink.click();

        const price = await this.browser.$(".Cart-Count");

        assert(await price.getText(), "1");

        const catalogLink = await this.browser.$(".Application-Menu").$("=Catalog");

        await catalogLink.click();

        await itemLink.click();

        await addToCartButton.click();

        await cartLink.click();

        assert(await price.getText(), "2");
    });

    it('Содержимое корзины должно сохраняться между перезагрузками страницы', async function () {
        await this.browser.url('http://localhost:3000/hw/store/catalog');

        const catalog = await this.browser.$(".Catalog");

        const fisrtItem = await catalog.$(".ProductItem[data-testid='0']");
        const fisrtItemDetailsLink = await fisrtItem.$(".ProductItem-DetailsLink");

        await fisrtItemDetailsLink.click();

        const addToCartButton = await this.browser.$(".ProductDetails-AddToCart");

        await addToCartButton.click();

        const catalogLink = await this.browser.$(".Application-Menu").$("=Catalog");

        await catalogLink.click();

        const secondItem = await catalog.$(".ProductItem[data-testid='1']");
        const secondItemDetailsLink = await secondItem.$(".ProductItem-DetailsLink");

        await secondItemDetailsLink.click();

        await addToCartButton.click();

        const cartLink = await this.browser.$(".Application-Menu").$("=Cart (2)");

        await cartLink.click();

        const itemsTable = await this.browser.$(".Cart-Table");

        assert(await itemsTable.isExisting());

        await this.browser.url('http://localhost:3000/hw/store/cart');

        const itemsTableAfterReload = await this.browser.$(".Cart-Table");

        assert(await itemsTableAfterReload.isExisting());
    });
});

describe('Корзина', async function () {
    it('В шапке рядом со ссылкой на корзину должно отображаться количество не повторяющихся товаров в ней', async function () {
        await this.browser.url('http://localhost:3000/hw/store/catalog');

        const catalog = await this.browser.$(".Catalog");

        const fisrtItem = await catalog.$(".ProductItem[data-testid='0']");
        const fisrtItemDetailsLink = await fisrtItem.$(".ProductItem-DetailsLink");

        await fisrtItemDetailsLink.click();

        const addToCartButton = await this.browser.$(".ProductDetails-AddToCart");

        await addToCartButton.click();

        const catalogLink = await this.browser.$(".Application-Menu").$("=Catalog");

        await catalogLink.click();

        const secondItem = await catalog.$(".ProductItem[data-testid='1']");
        const secondItemDetailsLink = await secondItem.$(".ProductItem-DetailsLink");

        await secondItemDetailsLink.click();

        await addToCartButton.click();
        await addToCartButton.click();

        const cartLink = await this.browser.$(".Application-Menu").$("=Cart (2)");

        assert(await cartLink.isExisting());
        assert(await cartLink.getText(), "Cart (2)");
    });

    it('В корзине должна отображаться таблица с добавленными в нее товарами', async function () {
        await this.browser.url('http://localhost:3000/hw/store/catalog');

        const catalog = await this.browser.$(".Catalog");

        const fisrtItem = await catalog.$(".ProductItem[data-testid='0']");
        const fisrtItemDetailsLink = await fisrtItem.$(".ProductItem-DetailsLink");

        await fisrtItemDetailsLink.click();

        const addToCartButton = await this.browser.$(".ProductDetails-AddToCart");

        await addToCartButton.click();

        const catalogLink = await this.browser.$(".Application-Menu").$("=Catalog");

        await catalogLink.click();

        const secondItem = await catalog.$(".ProductItem[data-testid='1']");
        const secondItemDetailsLink = await secondItem.$(".ProductItem-DetailsLink");

        await secondItemDetailsLink.click();

        await addToCartButton.click();

        const cartLink = await this.browser.$(".Application-Menu").$("=Cart (2)");

        await cartLink.click();

        const itemsTable = await this.browser.$(".Cart-Table");

        assert(await itemsTable.isExisting())

        const firstItemInCart = await itemsTable.$("tr[data-testid='0']");
        const secondItemInCart = await itemsTable.$("tr[data-testid='1']");

        assert(await firstItemInCart.isExisting());
        assert(await secondItemInCart.isExisting());
    });

    it('Для каждого товара должны отображаться название, цена, количество , стоимость, а также должна отображаться общая сумма заказа', async function () {
        await this.browser.url('http://localhost:3000/hw/store/catalog');

        const catalog = await this.browser.$(".Catalog");

        const fisrtItem = await catalog.$(".ProductItem[data-testid='0']");
        const fisrtItemDetailsLink = await fisrtItem.$(".ProductItem-DetailsLink");

        await fisrtItemDetailsLink.click();

        const addToCartButton = await this.browser.$(".ProductDetails-AddToCart");

        await addToCartButton.click();
        await addToCartButton.click();

        const catalogLink = await this.browser.$(".Application-Menu").$("=Catalog");

        await catalogLink.click();

        const secondItem = await catalog.$(".ProductItem[data-testid='1']");
        const secondItemDetailsLink = await secondItem.$(".ProductItem-DetailsLink");

        await secondItemDetailsLink.click();

        await addToCartButton.click();

        const cartLink = await this.browser.$(".Application-Menu").$("=Cart (2)");

        await cartLink.click();

        const itemsTable = await this.browser.$(".Cart-Table");

        assert(await itemsTable.isExisting())

        const firstItemInCart = await itemsTable.$("tr[data-testid='0']");
        const firstItemInCartName = await firstItemInCart.$(".Cart-Name");
        const firstItemInCartPrice = await firstItemInCart.$(".Cart-Price");
        const firstItemInCartCount = await firstItemInCart.$(".Cart-Count");
        const firstItemInCartTotal = await firstItemInCart.$(".Cart-Total");

        const secondItemInCart = await itemsTable.$("tr[data-testid='1']");
        const secondItemInCartName = await secondItemInCart.$(".Cart-Name");
        const secondItemInCartPrice = await secondItemInCart.$(".Cart-Price");
        const secondItemInCartCount = await secondItemInCart.$(".Cart-Count");
        const secondItemInCartTotal = await secondItemInCart.$(".Cart-Total");


        assert(await firstItemInCart.isExisting());
        assert(await firstItemInCartName.isExisting());
        assert(await firstItemInCartPrice.isExisting());
        assert.equal(await firstItemInCartCount.getText(), "8");
        assert(await firstItemInCartTotal.isExisting());

        assert(await secondItemInCart.isExisting());
        assert(await secondItemInCartName.isExisting());
        assert(await secondItemInCartPrice.isExisting());
        assert.equal(await secondItemInCartCount.getText(), "5");
        assert(await secondItemInCartTotal.isExisting());
    });

    it('В корзине должна быть кнопка "очистить корзину", по нажатию на которую все товары должны удаляться', async function () {
        await this.browser.url('http://localhost:3000/hw/store/catalog');

        const catalog = await this.browser.$(".Catalog");

        const fisrtItem = await catalog.$(".ProductItem[data-testid='0']");
        const fisrtItemDetailsLink = await fisrtItem.$(".ProductItem-DetailsLink");

        await fisrtItemDetailsLink.click();

        const addToCartButton = await this.browser.$(".ProductDetails-AddToCart");

        await addToCartButton.click();
        await addToCartButton.click();

        const catalogLink = await this.browser.$(".Application-Menu").$("=Catalog");

        await catalogLink.click();

        const secondItem = await catalog.$(".ProductItem[data-testid='1']");
        const secondItemDetailsLink = await secondItem.$(".ProductItem-DetailsLink");

        await secondItemDetailsLink.click();

        await addToCartButton.click();

        const cartLink = await this.browser.$(".Application-Menu").$("=Cart (2)");

        await cartLink.click();

        const itemsTable = await this.browser.$(".Cart-Table");
        const clearCartButton = await this.browser.$(".Cart-Clear");

        await clearCartButton.click();

        assert.equal(await itemsTable.isExisting(), false);
    });

    it('Если корзина пустая, должна отображаться ссылка на каталог товаров', async function () {
        await this.browser.url('http://localhost:3000/hw/store/cart');

        const link = await this.browser.$("a[href='/hw/store/catalog']");

        assert(await link.isExisting());
    });
});