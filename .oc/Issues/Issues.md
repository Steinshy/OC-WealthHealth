https://github.com/OpenClassrooms-Student-Center/P12_Front-end/issues/1

The date picker jQuery plugin that we use on the Create Employee page is often times slow and sometimes completely unresponsive. Let's convert this to a React component to optimize the rendering and hopefully speed up the overall app.

Here's the plugin we are currently using for date pickers: https://github.com/xdan/datetimepicker

These are the ones we are referring to:


https://github.com/OpenClassrooms-Student-Center/P12_Front-end/issues/3

The modal dialog that we are currently using to confirm when new employee records are created does not match the design system that our designers want to use, and this plugin is very incompatible with applying custom styles. Let's create our own React component for this which we can style however we need to.

This is the jQuery plugin that we're currently using for modals: https://github.com/kylefox/jquery-modal

Here is what it currently looks like in the app:


https://github.com/OpenClassrooms-Student-Center/P12_Front-end/issues/4

The dropdowns that we are currently using in the Create Employee form, for selection of address state and employee department, are pretty slow and behave inconsistently sometimes. Users have reported the order of the dropdown options changing unexpectedly, as well as other issues such as seeing very long load times to populate the options. Let's create a React component for this and see if we can speed it up and stabilize it.

This is the jQuery plugin that we are currently using for our dropdowns: https://github.com/jquery/jquery-ui/blob/master/ui/widgets/selectmenu.js

Here's an example of what it looks like in our app:

https://github.com/OpenClassrooms-Student-Center/P12_Front-end/issues/2

The table plugin that we use to list current employees is very slow to load new data when we add new employee records. It seems to be creating and loading the whole table each time. Let's create a React component that is smarter about rendering new data and only renders new rows when they are added.

Here is the jQuery plugin that we are currently using for the current employees list: https://github.com/DataTables/DataTables

Here's what it current looks like in the app: