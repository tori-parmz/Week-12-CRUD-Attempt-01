//class for house
class MenuCategory {
    constructor(name) {
        this.name = name;
        this.menuItems = [];
    }
    addMenuItem(name, price, description) {
        this.menuItems.push(new MenuItem(name, price, description));
    }
}

//create classes for rooms
class MenuItem {
    constructor(name, price, description) {
        this.name = name;
        this.price = price;
        this.description = description;
    }
}

//create class for house service AJAX

class MenuService {
    static url = "https://ancient-taiga-31359.herokuapp.com/api/houses";
    static getAllCategories() {
        return $.get(this.url);

    }

    static getCategory(id) {
        return $.get(this.url + `/${id}`);
    }

    static createCategory(menuItem) {
        return $.post(this.url, menuItem);
    }

    static updateCategory(menuCategory) {
        return $.ajax({
            url: this.url + `/${menuCategory._id}`,
            dataType: "json",
            data: JSON.stringify(menuCategory),
            contentType: 'application/json',
            type: 'PUT'

        });
    }

    static deleteCategory(id) {
        return $.ajax({
        url: this.url + `/${id}`,
        type: 'DELETE'

        });
    }
}

//create class to clear out the DOM

class DOMManager {
    static houses;

    static getAllHouses() {
        MenuService.getAllHouses().then(houses => this.render(houses));
    }

    static createHouse(name) {
        MenuService.createHouse(new House(name))
            .then(() => {
                return MenuService.getAllHouses();
            })
            .then((houses) => this.render(houses));
    }

    static deleteHouse(id) {
        MenuService.deleteHouse(id)
        .then(() => {
            return MenuService.getAllHouses();
        })
        .then((houses) => this.render(houses));
    }

    static addRoom(id) {
        for(let house of this.houses) {
            if (house._id == id) {
                house.rooms.push(new Room($(`#${house._id}-room-name`).val(), $(`#${house._id}-room-area`).val()));
                MenuService.updateHouse(house)
                .then(() => {
                    return MenuService.getAllHouses();
                })
                .then((houses) => this.render(houses));
            }
        }
    }

    static deleteRoom(houseId, roomId) {
        for (let house of this.houses) {
            if (house._id == houseId) {
                for (let room of house.rooms) {
                    if(room._id == roomId) {
                        house.rooms.splice(house.rooms.indexOf(room), 1);
                        MenuService.updateHouse(house)
                        .then(() => {
                            return MenuService.getAllHouses();
                        })
                        .then((houses) => this.render(houses));
                    }
                }
            }
        }
    }

    static render(houses) {
        this.houses = houses;
        $('#app').empty();
        for (let house of houses) {
            $('#app').prepend(
                `<div id="${house._id}" class="card">
                <div class="card-header">
                <h2>${house.name}</h2>
                <button class="btn btn-danger" onclick="DOMManager.deleteHouse('${house._id}')">Delete</button>
                </div>
                <div class="card-body">
                    <div class="card">
                    <div class="row">
                    <div class="col-sm">
                    <input type="text" id="${house._id}-room-name" class="form-control" Placeholder="Room Name">
                    </div>
                    <div class="col-sm">
                    <input type="text" id="${house._id}-room-area" class="form-control" Placeholder="Room Area">
                    </div>
                    </div><br>
                    <button id="${house._id}-new-room" onClick="DOMManager.addRoom('${house._id}')" class="btn btn-primary form-control">Add</button>
                    </div>
                </div>
                </div><br>`

            );

            for (let room of house.rooms) {
                $(`#${house._id}`).find('.card-body').append(
                    `<p>
                    <span id="name-${room._id}"><strong>Name: </strong> ${room.name}</span>
                    <span id="area-${room._id}"><strong>Area: </strong> ${room.area}</span>
                    <button class="btn btn-danger" onClick="DOMManager.deleteRoom('${house._id}', '${room._id}')">Delete Room</button>
                    `
                )
            }

            
        }

        
    }

}

$('#create-new-house').on("click", () => {
    DOMManager.createHouse($('#new-house-name').val());
    $('#new-house-name').val('')
})

DOMManager.getAllHouses();