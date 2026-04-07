const express = require("express")
const router = express.Router()

router.get("/", (req, res) => {
  res.json({
    flags: [
      {
        flagKey: "diwali_sale_banner",
        isEnabled: true,
        rolloutPercentage: 50
      },
      {
        flagKey: "new_checkout",
        isEnabled: true,
        rolloutPercentage: 30
      }
    ]
  })
})

module.exports = router