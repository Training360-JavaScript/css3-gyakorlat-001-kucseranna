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

    /*
    background: #ffc107;
    color: white;
    border-radius: 100%;
    position: absolute;
    text-align: center;
    line-height: 80px;
    */
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

    /*
    10. szélesség 25 pixel,
    11. magasság 3 pixel,
    12. háttérszín fehér,
    13. megjelenítés blokk szintű,
    14. pozíció abszolút
    
    width: 25px;
    height: 3px;
    background: white;
    display: block;
    position: absolute;
    top: 50%;
    left: 50%;
    */
    it('10. szabály', () => {
        cy.visit('');
        cy.get('body .hamburger').should('have.css', 'width', '25px');
    });
    
    it('11. szabály', () => {
        cy.visit('');
        cy.get('body .hamburger').should('have.css', 'height', '3px');
    });
    
    it('12. szabály', () => {
        cy.visit('');
        cy.get('body .hamburger').should('have.css', 'background-color', 'rgb(255, 255, 255)');
    });
    
    it('13. szabály', () => {
        cy.visit('');
        cy.get('body .hamburger').should('have.css', 'display', 'block');
    });
    
    it('14. szabály', () => {
        cy.visit('');
        cy.get('body .hamburger').should('have.css', 'position', 'absolute');
    });

});