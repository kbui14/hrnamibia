export default Ember.Route.extend(Ember.SimpleAuth.AuthenticatedRouteMixin, {
    modelName: null,
    moduleName: null,
    
    editPath: function() {
        var module = this.get('moduleName');
        return module + '.edit';
    }.property('moduleName'),
    
    deletePath: function() {
        var module = this.get('moduleName');
        return module + '.delete';        
    }.property('moduleName'),
    
    searchRoute: function() {
        var module = this.get('moduleName');
        return '/'+module + '/search';
    }.property('moduleName'),

    
    actions: {
        allItems: function() {
            this.transitionTo(this.get('moduleName')+'.index');
        },        
        
        closeModal: function() {
            this.disconnectOutlet({
                parentView: 'application',
                outlet: 'modal'
            });
        },
        newItem: function() {
            var newId = this.generateId();
            var data = {};
            if (newId) {
                data.id = newId;
            }
            var item = this.get('store').createRecord(this.get('modelName'), data);
            this.send('editItem', item);
        },
        deleteItem: function(item) {
            var deletePath = this.get('deletePath');
            this.controllerFor(deletePath).set('model', item);
            this.renderModal(deletePath);
        },        
        editItem: function(item) {
            var editPath = this.get('editPath');
            this.controllerFor(editPath).set('model',item);
            this.renderModal(editPath);     
        }
    },
    
    /**
     * Override this function to generate an id for a new record
     * @return a generated id;default is null which means that an
     * id will be automatically generated via Ember data.
     */
    generateId: function() {
        return null;                
    },
    
    model: function() {
        return this.store.find(this.get('modelName'));
    },
    
    renderModal: function(template) {
        this.render(template, {
            into: 'application',
            outlet: 'modal'
        });            
    },
    
    setupController: function(controller, model) { 
        var navigationController = this.controllerFor('navigation');
        navigationController.set('allowSearch',true);
        navigationController.set('searchRoute',this.get('searchRoute'));
        this._super(controller, model);
    }
});