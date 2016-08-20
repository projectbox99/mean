import { Http, BaseRequestOptions, Response, ResponseOptions, RequestMethod } from "@angular/http";
import { MockBackend, MockConnection } from "@angular/http/testing";

import { User } from "./users.service";


export let fakeBackendProvider = {
    // use fake backend in place of Http service for backend-less development
    provide: Http,
    useFactory: (backend, options) => {
        // configure fake backend
        backend.connections.subscribe((connection: MockConnection) => {
            // let testUser = { username: "test", password: "test", namesFirst: "Test", namesLast: "User", role : "admin" };
            let testUser = new User("id:8937472634",                    // id,
                "test", "test",                                         // username, password,
                "George", "Ganchev",                                    // namesFirst, namesLast,
                "g.ganchev@abv.bg", "+359 2 347 347", "0888 467823",    // email, phone1, phone2,
                "skype:349823euf34", "",                                // skypeId, photo,
                "admin", new Date);                                     // role, dateCreated

            // wrap in timeout to simulate server api call
            setTimeout(() => {

                // fake authenticate api end point
                if (connection.request.url.endsWith("/api/authenticate")
                    && connection.request.method === RequestMethod.Post) {
                    // get parameters from post request
                    let params = JSON.parse(connection.request.getBody());

                    // check user credentials and return fake jwt token if valid
                    if (params.username === testUser.username && params.password === testUser.password) {
                        connection.mockRespond(new Response(
                            new ResponseOptions({ status: 200,
                                body: { token: "fake-jwt-token", usr: JSON.stringify(testUser) } })
                        ));
                    } else {
                        connection.mockRespond(new Response(
                            new ResponseOptions({ status: 200 })
                        ));
                    }
                }

                // fake users api end point
                if (connection.request.url.endsWith("/api/userss") && connection.request.method === RequestMethod.Get) {
                    // check for fake auth token in header and return test users if valid, this security is implemented server side
                    // in a real application
                    if (connection.request.headers.get("Authorization") === "Bearer fake-jwt-token") {
                        connection.mockRespond(new Response(
                            new ResponseOptions({ status: 200, body: [testUser] })
                        ));
                    } else {
                        // return 401 not authorised if token is null or invalid
                        connection.mockRespond(new Response(
                            new ResponseOptions({ status: 401 })
                        ));
                    }
                }

            }, 500);

        });

        return new Http(backend, options);
    },
    deps: [MockBackend, BaseRequestOptions]
};