import { Template } from 'meteor/templating';
import { Tasks } from '../api/tasks.js';
import { ReactiveDict } from 'meteor/reactive-dict';

import './task.js';
import './body.html';
 
Template.body.helpers({
    tasks(){
        const instance = Template.instance();
        if (instance.state.get('hideCompleted')){
            return Tasks.find({checked: {$ne: true}}, {sort: {createdAt: -1}})
        }
        return Tasks.find({}, {sort: {createdAt: -1}});
    },
    incompleteCount(){
        return Tasks.find({checked: {$ne: true}}).count();
    }
});

Template.body.events({
    'submit .new-task'(event) {
      // Prevent default browser form submit
      event.preventDefault();
  
      // Get value from form element
      const target = event.target;
      const text = target.text.value;
        // Insert a task into the collection
        Meteor.call('tasks.insert', text);

      // Clear form
      target.text.value = '';
    },
    'change .hide-completed input' (event, instance){
        instance.state.set('hideCompleted', event.target.checked);
    }
  });
  Template.body.onCreated(function bodyOnCreated() {
      this.state = new ReactiveDict();
      Meteor.subscribe('tasks');
    })