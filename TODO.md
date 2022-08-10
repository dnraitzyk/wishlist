General

Functionality
- prompt in case trying to save invalid wishlist item
- Create a new wishlist
- Modify auto wishes and have them still save and be updated (only certain fields)
  - have to retrieve from backend once we know which we have or dont update certain values in DB
- add login
- export to file to send someone (excel?)
- add in verify in case an item changes or seems to have a matching item

Backend
- find common elements to simplify html parsing
- parse Etsy
- figure out Amazon captcha or refresh on frontend
- handle rei stock and cost

UI
- show add wish wishlist dropdown
  - items are built from distinct wishlist select from db
- show out of stock items as error and collapse them?
- add stock indicator
- banner
- nav menu fold up hamburger
- bootstrap?

Validation
-

BUGS
-
========================================================================
DONE
- merge refactoring into main
- add wishlistLink
- button CSS
- fields CSS
- link imported wishes to unique key so can be consistently edited
- add edit button on each wishlist item
- need something in name and cost field
- only numbers in cost/quantity