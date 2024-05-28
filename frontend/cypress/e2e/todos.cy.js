import "../support/commands"

describe("Todos", function () {
  beforeEach(function () {
    cy.task("db:seed").then((uid) => {
      cy.login(uid)
      cy.wrap(uid).as("uid")
    })
  })

  // R8UC1: Add todo
  it("Enter a description", function () {
    cy.getBySel("task-0").click()

    cy.getBySel("todo-add-input").clear()
    cy.getBySel("todo-add-submit").should("be.disabled")

    cy.getBySel("todo-add-input").type("Brew coffee")
    cy.getBySel("todo-add-submit").should("not.be.disabled")
  })

  it("Click the 'Add' button", function () {
    cy.getBySel("task-0").click()

    cy.getBySelLike("todo-item")
      .its("length")
      .then((initialCount) => {
        cy.getBySel("todo-add-input").clear()
        cy.getBySel("todo-add-input").type("Brew coffee")
        cy.getBySel("todo-add-submit").click()

        cy.getBySelLike("todo-item").should("have.length", initialCount + 1)
        cy.getBySel(`todo-item-${initialCount}`).should(
          "contain",
          "Brew coffee"
        )
      })
  })

  // R8UC2: Toggle todo
  it("Click the [active] toggle icon in front of the description", function () {
    cy.toggleTodo(false)
    cy.getBySel("task-0").click()

    cy.getBySel("todo-item-0").find('[data-test="toggle"]').click()
    cy.getBySel("todo-item-0")
      .find('[data-test="toggle"]')
      .should("have.class", "checked")
    cy.getBySel("todo-item-0")
      .find('[data-test="text"]')
      .should(($el) => {
        expect($el.css("text-decoration")).to.include("line-through")
      })
  })

  it("Click the [done] toggle icon in front of the description", function () {
    cy.toggleTodo(true)
    cy.getBySel("task-0").click()

    cy.getBySel("todo-item-0").find('[data-test="toggle"]').click()
    cy.getBySel("todo-item-0")
      .find('[data-test="toggle"]')
      .should("have.class", "unchecked")
    cy.getBySel("todo-item-0")
      .find('[data-test="text"]')
      .should(($el) => {
        expect($el.css("text-decoration")).not.to.include("line-through")
      })
  })

  // R8UC3: Delete todo
  it("Click the 'X' icon behind the description", function () {
    cy.getBySel("task-0").click()

    cy.getBySelLike("todo-item")
      .its("length")
      .then((initialCount) => {
        cy.getBySel("todo-item-0")
          .find('[data-test="text"]')
          .invoke("text")
          .then((text) => {
            cy.getBySel("todo-item-0").find('[data-test="delete"]').click()

            cy.getBySelLike("todo-item").should("have.length", initialCount - 1)
            cy.getBySelLike("todo-item").should("not.contain", text)
          })
      })
  })
})
