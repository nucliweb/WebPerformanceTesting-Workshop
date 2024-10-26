/// <reference types="cypress" />

/*
const defaultThresholds = {
  lcp: 2500,
  fid: 100,
  cls: 0.1,
  fcp: 1800,
  ttfb: 600,
  inp: 200
}
*/
const customThresholds = {
  lcp: 3000,
  fid: 100,
  fcp: 600,
  cls: 0.01,
  ttfb: 500,
  inp: 100,
};
context("Web Performance Testing", () => {
  beforeEach(() => {
    cy.viewport("iphone-x");
  });

  describe("Web Vitals", () => {
    it("should pass the audits for a page load, without intercation", () => {
      cy.vitals({
        url: "https://www.biznagafest.com/",
        thresholds: customThresholds,
        onReport(report) {
          expect(report.thresholds).to.equal(customThresholds);
          expect(report.results).to.have.property("lcp");
          expect(report.results).to.have.property("fid");
          expect(report.results).to.have.property("cls");
          expect(report.results).to.have.property("fcp");
          expect(report.results).to.have.property("ttfb");
          expect(report.results).to.have.property("inp");

          cy.log("------ onReport values ------");
          cy.log(JSON.stringify(report, undefined, 2));
          cy.log("-----------------------------");
        },
      });
    });

    it("should pass the audits intercation vitals", () => {
      cy.vitals({
        url: "https://www.biznagafest.com/",
        thresholds: customThresholds,
        onReport(report) {
          expect(report.thresholds).to.equal(customThresholds);
          expect(report.results).to.have.property("fid");
          expect(report.results).to.have.property("inp");

          cy.log("------ onReport values ------");
          cy.log(JSON.stringify(report, undefined, 2));
          cy.log("-----------------------------");
        },
      });
    });

    it("should pass the audits for a customer journey", () => {
      cy.startVitalsCapture({
        url: "https://www.biznagafest.com/",
      });
    });
  });
});
