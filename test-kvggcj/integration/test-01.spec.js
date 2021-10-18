function unquote(str) {
    return str.replace(/(^")|("$)/g, '');
}

Cypress.Commands.add(
    'before',
    {
        prevSubject: 'element',
    },
    (el, property) => {
        const win = el[0].ownerDocument.defaultView;
        const before = win.getComputedStyle(el[0], 'before');
        return unquote(before.getPropertyValue(property));
    },
);

Cypress.Commands.add(
    'after',
    {
        prevSubject: 'element',
    },
    (el, property) => {
        const win = el[0].ownerDocument.defaultView;
        const after = win.getComputedStyle(el[0], 'after');
        return unquote(after.getPropertyValue(property));
    },
);

describe('Ellenőrzések', () => {
    /*
    background: #009688;
    color: white;
    text-align: center;
    */
    it('1. szabály', () => {
        cy.visit('');
        cy.get('body').should('have.css', 'background-color', 'rgb(0, 150, 136)');
    });

    it('2. szabály', () => {
        cy.visit('');
        cy.get('body').should('have.css', 'color', 'rgb(255, 255, 255)');
    });

    it('3. szabály', () => {
        cy.visit('');
        cy.get('body').should('have.css', 'text-align', 'center');
    });

});