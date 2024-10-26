describe("CPU Throttling test", () => {
  it("simulates a slow CPU", () => {
    cy.startVitalsCapture({
      url: "https://react-inp-workshop.vercel.app/render",
    });
    cy.task("throttleCpu", 4); // Adjusts the CPU speed to 25%
    cy.wait(500);

    cy.get("button").realClick();
    cy.reportVitals({
      thresholds: {
        inp: 60,
      },
    });
  });
});
