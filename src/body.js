class Body {
  constructor() {
    var body = createSphere(0xccccee);
    body.scale.set(3, 3, 3);

    this.body = body;
  }

  getBody() {
    return this.body;
  }
}
