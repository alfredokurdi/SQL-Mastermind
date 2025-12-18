
import { Lesson } from './types';

export const LESSONS: Lesson[] = [
  // --- BEGINNER TRACK (FOCUS) ---
  {
    id: 'b1',
    title: '1. SELECTing Everything',
    description: 'The `SELECT` statement is the foundation of SQL. Use `*` to retrieve all columns from a table.',
    task: 'Retrieve all records from the `products` table.',
    expectedQuery: 'SELECT * FROM products;',
    difficulty: 'Beginner',
    schema: 'products (id, name, category, price, stock)',
    initialData: [
      { id: 1, name: 'Laptop', category: 'Electronics', price: 999.99, stock: 50 },
      { id: 2, name: 'Desk Chair', category: 'Furniture', price: 199.50, stock: 120 }
    ]
  },
  {
    id: 'b2',
    title: '2. Picking Columns',
    description: 'You can choose specific columns by naming them, separated by commas.',
    task: 'Retrieve only the `name` and `price` of all products.',
    expectedQuery: 'SELECT name, price FROM products;',
    difficulty: 'Beginner',
    schema: 'products (name, category, price)',
    initialData: [
      { name: 'Laptop', price: 999.99 },
      { name: 'Desk Chair', price: 199.50 }
    ]
  },
  {
    id: 'b3',
    title: '3. Column Aliasing (AS)',
    description: 'Use the `AS` keyword to give a column a temporary, more readable name in the results.',
    task: 'Select product `name` but rename the column to "Product_Title".',
    expectedQuery: 'SELECT name AS Product_Title FROM products;',
    difficulty: 'Beginner',
    schema: 'products (name)',
    initialData: [{ Product_Title: 'Laptop' }, { Product_Title: 'Desk Chair' }]
  },
  {
    id: 'b4',
    title: '4. Basic Math',
    description: 'SQL can perform arithmetic. You can add, subtract, multiply, or divide column values.',
    task: 'Select product `name` and show a "New_Price" that is 10% higher than the current `price`.',
    expectedQuery: 'SELECT name, price * 1.1 AS New_Price FROM products;',
    difficulty: 'Beginner',
    schema: 'products (name, price)',
    initialData: [
      { name: 'Laptop', New_Price: 1099.989 },
      { name: 'Desk Chair', New_Price: 219.45 }
    ]
  },
  {
    id: 'b5',
    title: '5. Unique Values (DISTINCT)',
    description: 'The `DISTINCT` keyword removes duplicate values from your result set.',
    task: 'Find all unique `category` names in the `products` table.',
    expectedQuery: 'SELECT DISTINCT category FROM products;',
    difficulty: 'Beginner',
    schema: 'products (category)',
    initialData: [{ category: 'Electronics' }, { category: 'Furniture' }]
  },
  {
    id: 'b6',
    title: '6. Filtering with WHERE',
    description: 'The `WHERE` clause filters rows. Use `=` to find exact matches.',
    task: 'Find all products in the "Electronics" category.',
    expectedQuery: "SELECT * FROM products WHERE category = 'Electronics';",
    difficulty: 'Beginner',
    schema: 'products (name, category)',
    initialData: [{ name: 'Laptop', category: 'Electronics' }]
  },
  {
    id: 'b7',
    title: '7. Using Inequalities',
    description: 'Use `>`, `<`, `>=`, or `<=` to filter numeric ranges.',
    task: 'Find all products with a `price` greater than 500.',
    expectedQuery: 'SELECT * FROM products WHERE price > 500;',
    difficulty: 'Beginner',
    schema: 'products (name, price)',
    initialData: [{ name: 'Laptop', price: 999.99 }]
  },
  {
    id: 'b8',
    title: '8. Not Equal (<>)',
    description: 'To exclude specific values, use `<>` or `!=`.',
    task: 'Find all products that are NOT in the "Furniture" category.',
    expectedQuery: "SELECT * FROM products WHERE category <> 'Furniture';",
    difficulty: 'Beginner',
    schema: 'products (name, category)',
    initialData: [{ name: 'Laptop', category: 'Electronics' }]
  },
  {
    id: 'b9',
    title: '9. Logical AND',
    description: 'Combine conditions. Both must be true for a row to appear.',
    task: 'Find "Electronics" that cost less than 1500.',
    expectedQuery: "SELECT * FROM products WHERE category = 'Electronics' AND price < 1500;",
    difficulty: 'Beginner',
    schema: 'products (name, category, price)',
    initialData: [{ name: 'Laptop', category: 'Electronics', price: 999.99 }]
  },
  {
    id: 'b10',
    title: '10. Logical OR',
    description: 'With `OR`, a row appears if either condition is true.',
    task: 'Find products that are in the "Electronics" OR "Furniture" categories.',
    expectedQuery: "SELECT * FROM products WHERE category = 'Electronics' OR category = 'Furniture';",
    difficulty: 'Beginner',
    schema: 'products (name, category)',
    initialData: [{ name: 'Laptop', category: 'Electronics' }, { name: 'Desk Chair', category: 'Furniture' }]
  },
  {
    id: 'b11',
    title: '11. Logical NOT',
    description: 'The `NOT` operator reverses a condition.',
    task: 'Find products that are NOT priced between 0 and 100.',
    expectedQuery: 'SELECT * FROM products WHERE NOT price <= 100;',
    difficulty: 'Beginner',
    schema: 'products (name, price)',
    initialData: [{ name: 'Laptop', price: 999.99 }]
  },
  {
    id: 'b12',
    title: '12. List Matching (IN)',
    description: 'Instead of multiple `OR` statements, use `IN` to match a list of values.',
    task: 'Find products in "Electronics", "Toys", or "Books".',
    expectedQuery: "SELECT * FROM products WHERE category IN ('Electronics', 'Toys', 'Books');",
    difficulty: 'Beginner',
    schema: 'products (name, category)',
    initialData: [{ name: 'Laptop', category: 'Electronics' }]
  },
  {
    id: 'b13',
    title: '13. Range Matching (BETWEEN)',
    description: 'Use `BETWEEN` to find values within an inclusive range.',
    task: 'Find products with a price between 100 and 1000.',
    expectedQuery: 'SELECT * FROM products WHERE price BETWEEN 100 AND 1000;',
    difficulty: 'Beginner',
    schema: 'products (name, price)',
    initialData: [
      { name: 'Laptop', price: 999.99 },
      { name: 'Desk Chair', price: 199.50 }
    ]
  },
  {
    id: 'b14',
    title: '14. Missing Data (IS NULL)',
    description: 'Check for empty fields using `IS NULL`. You cannot use `= NULL`.',
    task: 'Find products where the `stock` amount is missing (NULL).',
    expectedQuery: 'SELECT * FROM products WHERE stock IS NULL;',
    difficulty: 'Beginner',
    schema: 'products (name, stock)',
    initialData: [{ name: 'Mystery Box', stock: null }]
  },
  {
    id: 'b15',
    title: '15. Existing Data (IS NOT NULL)',
    description: 'The opposite of NULL check. Use this to find fields that have values.',
    task: 'Find all products that HAVE a `category` assigned.',
    expectedQuery: 'SELECT * FROM products WHERE category IS NOT NULL;',
    difficulty: 'Beginner',
    schema: 'products (name, category)',
    initialData: [{ name: 'Laptop', category: 'Electronics' }]
  },
  {
    id: 'b16',
    title: '16. Text Search (LIKE Prefix)',
    description: 'Use `LIKE` with `%` as a wildcard. `A%` matches anything starting with A.',
    task: 'Find products whose name starts with "L".',
    expectedQuery: "SELECT * FROM products WHERE name LIKE 'L%';",
    difficulty: 'Beginner',
    schema: 'products (name)',
    initialData: [{ name: 'Laptop' }]
  },
  {
    id: 'b17',
    title: '17. Text Search (LIKE Suffix)',
    description: '`%A` matches anything ending with A.',
    task: 'Find products whose category ends with "ics".',
    expectedQuery: "SELECT * FROM products WHERE category LIKE '%ics';",
    difficulty: 'Beginner',
    schema: 'products (category)',
    initialData: [{ category: 'Electronics' }]
  },
  {
    id: 'b18',
    title: '18. Text Search (LIKE Contains)',
    description: '`%A%` matches anything containing A.',
    task: 'Find products whose name contains the word "Chair".',
    expectedQuery: "SELECT * FROM products WHERE name LIKE '%Chair%';",
    difficulty: 'Beginner',
    schema: 'products (name)',
    initialData: [{ name: 'Desk Chair' }]
  },
  {
    id: 'b19',
    title: '19. Sorting (ORDER BY)',
    description: '`ORDER BY` sorts results alphabetically or numerically (ascending by default).',
    task: 'List all products sorted by `name` alphabetically.',
    expectedQuery: 'SELECT * FROM products ORDER BY name;',
    difficulty: 'Beginner',
    schema: 'products (name)',
    initialData: [{ name: 'Desk Chair' }, { name: 'Laptop' }]
  },
  {
    id: 'b20',
    title: '20. Descending Sort (DESC)',
    description: 'Add `DESC` after a column name to sort from high to low.',
    task: 'List all products sorted by `price` from highest to lowest.',
    expectedQuery: 'SELECT * FROM products ORDER BY price DESC;',
    difficulty: 'Beginner',
    schema: 'products (name, price)',
    initialData: [{ name: 'Laptop', price: 999.99 }, { name: 'Desk Chair', price: 199.50 }]
  },
  {
    id: 'b21',
    title: '21. Multiple Sorting',
    description: 'You can sort by multiple columns. If the first column has ties, the second is used.',
    task: 'Sort products by `category`, then by `price` (ascending).',
    expectedQuery: 'SELECT * FROM products ORDER BY category, price;',
    difficulty: 'Beginner',
    schema: 'products (category, price)',
    initialData: [
      { category: 'Electronics', price: 999.99 },
      { category: 'Furniture', price: 199.50 }
    ]
  },
  {
    id: 'b22',
    title: '22. Limiting Results',
    description: '`LIMIT` restricts how many rows you see. Great for "Top 10" lists.',
    task: 'Get only the first 1 product from the table.',
    expectedQuery: 'SELECT * FROM products LIMIT 1;',
    difficulty: 'Beginner',
    schema: 'products (id, name)',
    initialData: [{ id: 1, name: 'Laptop' }]
  },
  {
    id: 'b23',
    title: '23. Extremes (MIN & MAX)',
    description: 'Use `MIN()` and `MAX()` to find the lowest and highest values in a column.',
    task: 'Find the highest product price.',
    expectedQuery: 'SELECT MAX(price) FROM products;',
    difficulty: 'Beginner',
    schema: 'products (price)',
    initialData: [{ 'MAX(price)': 999.99 }]
  },
  {
    id: 'b24',
    title: '24. Counting Rows',
    description: '`COUNT(*)` tells you how many rows are in a table or match a filter.',
    task: 'Count how many products are in the "Electronics" category.',
    expectedQuery: "SELECT COUNT(*) FROM products WHERE category = 'Electronics';",
    difficulty: 'Beginner',
    schema: 'products (category)',
    initialData: [{ 'COUNT(*)': 1 }]
  },
  {
    id: 'b25',
    title: '25. Sum & Average',
    description: '`SUM()` totals a column, while `AVG()` calculates the mean.',
    task: 'Calculate the total value of all stock (price * stock).',
    expectedQuery: 'SELECT SUM(price * stock) FROM products;',
    difficulty: 'Beginner',
    schema: 'products (price, stock)',
    initialData: [{ 'SUM(price * stock)': 73939.50 }]
  },

  // --- INTERMEDIATE TRACK ---
  {
    id: 'i1',
    title: '26. Grouping (GROUP BY)',
    description: 'Use `GROUP BY` to aggregate values based on a category.',
    task: 'Find the average price for each category.',
    expectedQuery: 'SELECT category, AVG(price) FROM products GROUP BY category;',
    difficulty: 'Intermediate',
    schema: 'products (category, price)',
    initialData: [
      { category: 'Electronics', 'AVG(price)': 999.99 },
      { category: 'Furniture', 'AVG(price)': 199.50 }
    ]
  },
  {
    id: 'i2',
    title: '27. Filtering Groups (HAVING)',
    description: '`HAVING` is like `WHERE`, but for grouped data.',
    task: 'List categories that have more than 5 products.',
    expectedQuery: 'SELECT category, COUNT(*) FROM products GROUP BY category HAVING COUNT(*) > 5;',
    difficulty: 'Intermediate',
    schema: 'products (category)',
    initialData: [{ category: 'Electronics', 'COUNT(*)': 12 }]
  },
  {
    id: 'i3',
    title: '28. Combining Tables (JOIN)',
    description: '`JOIN` allows you to link tables using a shared ID.',
    task: 'Select product names and their category description by joining `products` and `categories` tables.',
    expectedQuery: 'SELECT p.name, c.description FROM products p JOIN categories c ON p.category_id = c.id;',
    difficulty: 'Intermediate',
    schema: 'products (name, category_id); categories (id, description)',
    initialData: [{ name: 'Laptop', description: 'Computing and Gadgets' }]
  },

  // --- ADVANCED TRACK ---
  {
    id: 'a1',
    title: '29. CTEs (WITH)',
    description: 'A CTE is a temporary table you can use within a query to simplify complex logic.',
    task: 'Use a CTE named `expensive_stuff` for products > 500, then count them.',
    expectedQuery: 'WITH expensive_stuff AS (SELECT * FROM products WHERE price > 500) SELECT COUNT(*) FROM expensive_stuff;',
    difficulty: 'Advanced',
    schema: 'products (id, price)',
    initialData: [{ 'COUNT(*)': 1 }]
  },
  {
    id: 'a2',
    title: '30. Window Functions',
    description: 'Window functions perform calculations across a set of rows related to the current row.',
    task: 'Rank products by price using `DENSE_RANK()`.',
    expectedQuery: 'SELECT name, price, DENSE_RANK() OVER(ORDER BY price DESC) as rank FROM products;',
    difficulty: 'Advanced',
    schema: 'products (name, price)',
    initialData: [{ name: 'Laptop', price: 999.99, rank: 1 }]
  }
];
