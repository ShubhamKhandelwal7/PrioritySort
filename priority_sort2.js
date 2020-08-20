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
    this.addButtons();
    this.addLinks();
    this.checkSearchable();
    this.addSearchBox();
    this.fillListItems();
    this.initialCount = this.$selectedList.attr("initial-items-count");
    this.isViewAll = true;
    this.isPriority = true;
    this.isAscending = true;
    this.refreshView();
    this.bindEvents();
  }

  bindEvents() {
    this.$showAllLink.on("click", () => {
      this.isViewAll = true;
      this.refreshView();
    });
    this.$showLessLink.on("click", () => {
      this.isViewAll = false;
      this.refreshView();
    });
    this.$alphabetSort.on("click", (elementAlphabetical) => {
      this.isPriority = false;
      this.highlightOrder(elementAlphabetical);
      this.refreshView();
    });
    this.$prioritySort.on("click", (elementPriority) => {
      this.isPriority = true;
      this.highlightOrder(elementPriority);
      this.refreshView();
    });

    this.$ascending.on("click", (element) => {
      this.isAscending = true;
      this.highlightOrder(element);
      this.refreshView();
    });
    this.$descending.on("click", (element) => {
      this.isAscending = false;
      this.highlightOrder(element);
      this.refreshView();
    });
    if (this.isSearchable) {
      this.$searchBox.on("keyup", (element) => {
        if (!element.target.value) {
          this.$showAllLink.show();
          this.$showLessLink.show();
          this.refreshView();
        } else {
          this.$showAllLink.hide();
          this.$showLessLink.hide();
          this.searchListItems(element);
        }
      });
    }
  }

  addButtons() {
    this.$divContainer = $("<div>").attr({ id: "button-div" });
    this.$descending = ($("<input type=button>").attr({ id: "descending", class: "order", value: "Descending" })).prependTo(this.$divContainer);
    this.$ascending = ($("<input type=button>").attr({ id: "ascending", class: "order selected", value: "Ascending" })).prependTo(this.$divContainer);
    this.$divContainer.prepend($("<br/>"));
    this.$alphabetSort = ($("<input type=button>").attr({ id: "alphabetSort", class: "sorting", value: "Sort Alphabetically" })).prependTo(this.$divContainer);
    this.$prioritySort = ($("<input type=button>").attr({ id: "prioritySort", class: "sorting selected", value: "Sort Priority" })).prependTo(this.$divContainer);
    this.$selectedList.prepend(this.$divContainer);
  }

  addLinks() {
    this.$showAllLink = ($("<a>").attr({ href: "#", id: "showAll" }).html("Show All ")).appendTo(this.$selectedList);
    this.$showLessLink = ($("<a>").attr({ href: "#", id: "showLess" }).html("Show Less ")).appendTo(this.$selectedList);
  }

  addSearchBox() {
    if (this.isSearchable) {
      this.$divContainer.append($("<br/>"));
      this.$searchLabel = ($("<label>").attr({ id: "searchLabel" }).html("Search: ")).appendTo(this.$divContainer);
      this.$searchBox = ($("<input type=search>").attr({ id: "search" })).appendTo(this.$divContainer);
    }
  }

  fillListItems() {
    this.$selectedList.children("li").each((index, subList) => {
      this.listItems.push(new ListItem($(subList)));
    });
  }

  refreshView() {
    if (this.isPriority) {
      if (this.isViewAll) {
        this.visibleLineItems = this.selectFirstNLineitems(this.sortByPriority(), this.listItems.length);
      } else {
        this.visibleLineItems = this.selectFirstNLineitems(this.sortByPriority(), this.initialCount);
      }
    } else {
      if (this.isViewAll) {
        this.visibleLineItems = this.selectFirstNLineitems(this.sortByAlphabet(), this.listItems.length);
      } else {
        this.visibleLineItems = this.selectFirstNLineitems(this.sortByAlphabet(), this.initialCount);
      }
    }
    this.displayLineItems(this.visibleLineItems);
  }

  selectFirstNLineitems(sortedList, initialCount) {
    return sortedList.splice(0, initialCount);
  }

  sortByPriority() {
    this.isPriority = true;
    var sortedListPriority = [...this.listItems];
    if (this.isAscending) {
      sortedListPriority.sort((a, b) => {
        return (b.priorityOrder) < (a.priorityOrder) ? 1 : -1;
      });
    } else {
      sortedListPriority.sort((b, a) => {
        return (b.priorityOrder) < (a.priorityOrder) ? 1 : -1;
      });
    }
    return sortedListPriority;
  }

  sortByAlphabet() {
    var sortedListAlpha = [...this.listItems];
    if (this.isAscending) {
      sortedListAlpha.sort((a, b) => {
        return (b.listItem.toUpperCase() < a.listItem.toUpperCase()) ? 1 : -1;
      });
    } else {
      sortedListAlpha.sort((b, a) => {
        return (b.listItem.toUpperCase() < a.listItem.toUpperCase()) ? 1 : -1;
      });
    }
    return sortedListAlpha;
  }

  highlightOrder(element) {
    var className = $(element.target).attr("class");
    $(element.target).addClass("selected").siblings("." + className).removeClass("selected");
  }

  displayLineItems(visibleLineItems) {
    this.$selectedList.children("li").remove();
    var array = [];
    $(visibleLineItems).each((index, value) => {
      array[index] = value.domElement;
    });
    this.$divContainer.after(array);
  }

  checkSearchable() {
    if (this.$selectedList.attr("data-search")) {
      this.isSearchable = true;
    } else {
      this.isSearchable = false;
    }
  }
  searchListItems(element) {
    this.filteredList = this.listItems.filter((listItem) => {
      return listItem.listItem.toLowerCase().includes(element.target.value.toLowerCase());
    });
    this.displayLineItems(this.filteredList);
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
