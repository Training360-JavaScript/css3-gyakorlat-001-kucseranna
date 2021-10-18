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

    it('7. szabály', () => {
        cy.visit('');
        cy.get('body .menu-item').should('have.css', 'position', 'absolute');
    });

    it('8. szabály', () => {
        cy.visit('');
        cy.get('body .menu-item').should('have.css', 'text-align', 'center');
    });

    it('9. szabály', () => {
        cy.visit('');
        cy.get('body .menu-item').should('have.css', 'line-height', '80px');
    });

});