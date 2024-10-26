describe("Content Visibility Test", () => {
  beforeEach(() => {
    cy.viewport("iphone-x");
    cy.visit("https://www.biznagafest.com/");
  });

  it("checks for content-visibility: auto elements", () => {
    cy.window().then((win) => {
      const results = win.eval(`
        (() => {
          // Get the name of the node
          function getName(node) {
            const name = node.nodeName;
            return node.nodeType === 1
              ? name.toLowerCase()
              : name.toUpperCase().replace(/^#/, '');
          }

          // Get the selector
          const getSelector = (node) => {
            let sel = '';

            try {
              while (node && node.nodeType !== 9) {
                const el = node;
                const part = el.id
                  ? '#' + el.id
                  : getName(el) +
                  (el.classList &&
                    el.classList.value &&
                    el.classList.value.trim() &&
                    el.classList.value.trim().length
                    ? '.' + el.classList.value.trim().replace(/\s+/g, '.')
                    : '');
                if (sel.length + part.length > (100) - 1) return sel || part;
                sel = sel ? part + '>' + sel : part;
                if (el.id) break;
                node = el.parentNode;
              }
            } catch (err) {
              // Do nothing...
            }
            return sel;
          };

          const getNodesWithContentVisibility = (node) => {
            // Get the computed style
            let cs = window.getComputedStyle(node);
            let cv = cs['content-visibility'];

            // If we find content-visibility: auto, add it to the table
            if (cv && cv === 'auto') {
              ret.autoTable.push({ selector: getSelector(node), ContentVisibility: cs['content-visibility'] });
              ret.autoNodeArray.push(node);
            }

            // Recursively call this function for each child node
            for (let i = 0; i < node.children.length; i++) {
              getNodesWithContentVisibility(node.children[i]);
            }
          }

          let ret = {
            autoTable: [],
            autoNodeArray: []
          };

          getNodesWithContentVisibility(document.body);
          return ret;
        })()
      `);

      // We now make the assertions based on the original logic
      if (results.autoTable.length === 0) {
        // Assertion for when there are no elements with content-visibility: auto
        expect(results.autoTable).to.have.length(
          0,
          "No content-visibility: auto found. Consider applying content-visibility: auto to offscreen content (the footer perhaps?)",
        );
      } else {
        // Assertions for when we do find elements
        expect(results.autoTable).to.have.length.above(0, "Found elements with content-visibility: auto");

        // We verify that each element in autoTable has the correct property
        results.autoTable.forEach((item) => {
          expect(item).to.have.property("ContentVisibility", "auto");
          expect(item).to.have.property("selector").that.is.a("string");
        });
      }
    });
  });
});
