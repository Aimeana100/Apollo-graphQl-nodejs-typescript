import { objectType } from "nexus";

export const AuthType = objectType({
    name: "AuthType",
    definition(t) {
        t.nonNull.string("token"),
        t.nonNull.field("user", {
            type: "User",
        })
    }
})