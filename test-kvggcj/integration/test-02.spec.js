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
    
    it('4. szabály', () => {
        cy.visit('');
        cy.get('body .menu-item').should('have.css', 'background-color', 'rgb(255, 193, 7)');
    });

    it('5. szabály', () => {
        cy.visit('');
        cy.get('body .menu-item').should('have.css', 'color', 'rgb(255, 255, 255)');
    });

    it('6. szabály', () => {
        cy.visit('');
        cy.get('body .menu-item').should('have.css', 'border-radius', '100%');
    });

});