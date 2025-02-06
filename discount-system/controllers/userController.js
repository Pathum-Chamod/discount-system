function calculateDiscount(user) {
    let totalAmount = user.projects.reduce((sum, project) => sum + project.amount, 0);
  
    if (totalAmount >= 200000) {
      return 40; // 40% discount
    } else if (totalAmount >= 100000) {
      return 25; // 25% discount
    } else if (totalAmount >= 50000) {
      return 10; // 10% discount
    } else {
      return 0; // No discount
    }
  }
  
  module.exports = { calculateDiscount };
  