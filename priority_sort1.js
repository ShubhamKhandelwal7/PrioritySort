/* global document, $ */
class PriorityListManager {
  constructor(defaultSelector, customSelector) {
    var updatedSelector = Object.assign({}, defaultSelector, customSelector);
    this.$mainList = $(updatedSelector.mainList);
    this.$listContainer = $(updatedSelector.mainList);
    this.lists = [];
  }

  init() {
    this.$mainList.each((index, value) => {
      this.lists.push(new List(value));
    });
  }
}

class List {
  constructor(listObject) {
    this.$selectedList = $(listObject);
    this.listItems = [];
    this.$selectedList.append($("<a>").attr({ href: "#", id: "showAll" }).html("Show All "));
    this.$selectedList.append($("<a>").attr({ href: "#", id: "showLess" }).html("Show Less "));
    this.$selectedList.children("li").each((index, subList) => {
      this.listItems.push(new ListItem($(subList)));
    });
    this.initialCount = this.$selectedList.attr("initial-items-count");
    this.currentView = "few";
    var sortedList = this.sortByPriority();
    this.visibleLineItems = this.selectFirstNLineitems(sortedList, this.initialCount);
    this.displayLineItems(this.visibleLineItems)
    this.bindEvents();
  }

  bindEvents() {
    this.$selectedList.children("#showAll").on("click", () => {
      this.currentView = "all";
      this.visibleLineItems = this.selectFirstNLineitems(this.sortByAlphabet(), this.listItems.length);
      this.displayLineItems(this.visibleLineItems);
    });

    this.$selectedList.children("#showLess").on("click", () => {
      this.currentView = "few";
      this.visibleLineItems = this.selectFirstNLineitems(this.sortByPriority(), this.initialCount);
      this.displayLineItems(this.visibleLineItems);
    });
  }
  selectFirstNLineitems(sortedList, initialCount) {
    return sortedList.splice(0, initialCount);
  }

  sortByPriority() {
    var sortedListPriority = [...this.listItems];
    sortedListPriority.sort((a, b) => {
      return (b.priorityOrder) < (a.priorityOrder) ? 1 : -1;
    });
    return sortedListPriority;
  }

  sortByAlphabet() {
    var sortedListAlpha = [...this.listItems];
    sortedListAlpha.sort((a, b) => {
      return (b.listItem.toUpperCase() < a.listItem.toUpperCase()) ? 1 : -1;
    });
    return sortedListAlpha;
  }

  displayLineItems(visibleLineItems) {
    this.$selectedList.children("li").remove();
    var array = [];
    $(visibleLineItems).each((index, value) => {
      array[index] = value.domElement;
    });
    this.$selectedList.prepend(array);
  }
}

class ListItem {
  constructor(subListItems) {
    this.listItem = subListItems.text();
    this.priorityOrder = subListItems.attr("priority-order");
    this.domElement = subListItems;
  }
}

$(document).ready(() => {
  var defaultSelector = {
    mainList: ".priority-sort",
    listContainer: "list-container",
  };
  var customSelector = {};
  var priorityListManager = new PriorityListManager(defaultSelector, customSelector);
  priorityListManager.init();
});
