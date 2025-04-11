import {expect} from 'chai';
import sinon from 'sinon';
import {CategoryController} from '../../controllers';
import {CategoriesRepository} from '../../repositories';
import {Categories} from '../../models';
import {Count} from '@loopback/repository';

describe('CategoryController', () => {
  let categoryController: CategoryController;
  let categoriesRepositoryStub: sinon.SinonStubbedInstance<CategoriesRepository>;

  beforeEach(() => {
    categoriesRepositoryStub = sinon.createStubInstance(
      CategoriesRepository,
    ) as sinon.SinonStubbedInstance<CategoriesRepository>;

    // Initialize the controller with the stubbed repository
    categoryController = new CategoryController(categoriesRepositoryStub);
  });

  it('should create a new category', async () => {
    const newCategory = new Categories({
      categoryId: 'c1',
      categoryName: 'New Category',
    });
    categoriesRepositoryStub.create.resolves(newCategory); // Stub the 'create' method

    const result = await categoryController.create(newCategory);

    // Used Chai's expect for assertion
    expect(result).to.eql(newCategory); // Check if the returned result is as expected
    sinon.assert.calledOnce(categoriesRepositoryStub.create);
  });

  it('should return count of categories', async () => {
    const count: Count = {count: 10};
    categoriesRepositoryStub.count.resolves(count);

    const result = await categoryController.count();

    expect(result).to.eql(count); // Checking the result matches the expected count
    sinon.assert.calledOnce(categoriesRepositoryStub.count);
  });

  it('should return all categories', async () => {
    const categoriesArray = [
      new Categories({categoryName: 'Category 1'}),
      new Categories({categoryName: 'Category 2'}),
    ];
    categoriesRepositoryStub.find.resolves(categoriesArray); // Stub the 'find' method

    const result = await categoryController.find();

    // Use Chai's expect for assertion
    expect(result).to.eql(categoriesArray); // Checks if the categories returned are correct
    sinon.assert.calledOnce(categoriesRepositoryStub.find);
  });

  it('should update categories', async () => {
    const count: Count = {count: 2};
    categoriesRepositoryStub.updateAll.resolves(count); // 'updateAll' method

    const result = await categoryController.updateAll(
      new Categories({categoryName: 'Updated Category'}),
    );

    // Use Chai's expect for assertion
    expect(result).to.eql(count);
    sinon.assert.calledOnce(categoriesRepositoryStub.updateAll);
  });

  it('should delete a category by id', async () => {
    const categoryId = '1';
    categoriesRepositoryStub.deleteById.resolves(); // deleteById method

    await categoryController.deleteById(categoryId);

    sinon.assert.calledOnce(categoriesRepositoryStub.deleteById);
  });
});

//npm install --save-dev jasmine @loopback/testlab @types/jasmine ts-jest sinon @types/chai chai
// npm i --save-dev @types/chai
