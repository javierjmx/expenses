const expenseNotFound = new Error('Expense not found.');
expenseNotFound.status = 404;

const categoryNotFound = new Error('Category not found.');
categoryNotFound.status = 404;

const invalidName = new Error('Invalid category name.');
invalidName.status = 400;

const invalidParams = new Error('Invalid parameters');
invalidParams.status = 400;

module.exports = {
  expenseNotFound,
  categoryNotFound,
  invalidName,
  invalidParams,
};
