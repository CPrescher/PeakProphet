import {PolynomialModel} from "./polynomial.model";

describe('PolynomialModel', () => {
  it('should create', () => {
    expect(new PolynomialModel()).toBeTruthy();
  });

  it('should evaluate', () => {
    let model = new PolynomialModel(2, 1, 2, 3);
    expect(model.evaluate([1,2,3])).toEqual([6, 17, 34]);
  });

  it('should get parameter', () => {
    let model = new PolynomialModel(2, 1, 2, 3);
    expect(model.getParameter("c0").value).toEqual(1);
    expect(model.getParameter("c1").value).toEqual(2);
    expect(model.getParameter("c2").value).toEqual(3);
  });

  it('should set parameter', () => {
    let model = new PolynomialModel(2, 1, 2, 3);
    model.getParameter("c0").value = 4;
    expect(model.getParameter("c0").value).toEqual(4);
  });
});
