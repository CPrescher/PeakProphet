import {QuadraticModel} from "./quadratic.model";

describe('QuadraticModel', () => {
  it('should create', () => {
    expect(new QuadraticModel()).toBeTruthy();
  });

  it('should evaluate', () => {
    let model = new QuadraticModel(2, 1, 2);
    expect(model.evaluate([1,2,3])).toEqual([5, 12, 23]);
  });

  it('should get parameter', () => {
    let model = new QuadraticModel(2, 1, 2);
    expect(model.getParameter("a").value).toEqual(2);
    expect(model.getParameter("b").value).toEqual(1);
    expect(model.getParameter("c").value).toEqual(2);
  });

  it('should set parameter', () => {
    let model = new QuadraticModel(2, 1, 2);
    model.getParameter("a").value = 4;
    expect(model.getParameter("a").value).toEqual(4);
  });

  it('should guess', () => {
    let model = new QuadraticModel();
    model.guess([1, 2, 3], [3, 5, 8]);
    expect(model.getParameter("a").value).toEqual(0);
    expect(model.getParameter("b").value).toEqual(2.5);
    expect(model.getParameter("c").value).toEqual(0.5);
  });
});
