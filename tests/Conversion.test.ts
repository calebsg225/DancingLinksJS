import Convert from "../src/DLX/Conversion";

describe ('testing conversion from exact cover to dlx input', () => {
  const matrixOne: (0|1)[][] = [
    [0, 0, 1, 0, 1, 0 ,0],
    [1, 0, 0, 1, 0, 0, 1], 
    [0, 1, 1, 0, 0, 1, 0], 
    [1, 0, 0, 1, 0, 1, 0],
    [0, 1, 0, 0, 0, 0, 1],
    [0, 0, 0, 1, 1, 0, 1]
  ];
  test(`test dlx conversion from matrix of 0's and 1's`, () => {
    const nodes = Convert.fromMatrix(matrixOne);
    expect(nodes[0]).toEqual({
      nodeType: 'first',
      leftNode: 7,
      rightNode: 1
    });
    expect(nodes[10]).toEqual({
      nodeType: 'item',
      headerNode: 5,
      upNode: 5,
      downNode: 28
    });
    expect(nodes[30]).toEqual({
      nodeType: 'spacer',
      upNode: 27,
      downNode: 30
    });
    expect(nodes[25]).toEqual({
      nodeType: 'item',
      headerNode: 7,
      upNode: 14,
      downNode: 29
    });
    expect(nodes[28]).toEqual({
      nodeType: 'item',
      headerNode: 5,
      upNode: 10,
      downNode: 5
    });
  });
});