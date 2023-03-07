import {LinearModel} from "./linear.model";

describe('LinearModel', () => {
  it('should create', () => {
    expect(new LinearModel()).toBeTruthy();
  });

  it('should evaluate', () => {
    let model = new LinearModel(1, 2);
    expect(model.evaluate([1,2,3])).toEqual([3, 5, 7]);
  });

  it('should get parameter', () => {
    let model = new LinearModel(2, 1);
    expect(model.getParameter("intercept").value).toEqual(2);
    expect(model.getParameter("slope").value).toEqual(1);
  });

  it('should set parameter', () => {
    let model = new LinearModel(2, 1);
    model.getParameter("intercept").value = 4;
    expect(model.getParameter("intercept").value).toEqual(4);
  });

  it('should guess', () => {
    let model = new LinearModel();
    model.guess([1,2,3], [3,5,8]);
    expect(model.getParameter("intercept").value).toEqual(0.5);
    expect(model.getParameter("slope").value).toEqual(2.5);
  });
})
