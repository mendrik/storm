# Storm

An opinionated, not working, abandoned functional ORM experiment.

# Background

The idea was threefold:

1)
To create a database schema in pure typescript, instead of having sql or own languages for it.
See [model example](https://github.com/mendrik/storm/blob/main/src/model.ts).

2) Being able to work on top of database data in a functional way, where storm behaves like a `pipe`.

```typescript
storm(users.address.city)(
  orderBy('zipCode', true),
  filter(propEq('zipCode', 770)),
)
```

3) Make everything typesafe. Generated objects could represent table joins as in `users.address.city`.
Columns can be accessed as properties and homonymous columns would be prefixed with table names users_id, address_id, city_id etc.


# Status

I gave up on it after running into type problems how to make sure orderBy() could not be written before filter() in a storm-pipe. 
But all in all i had fun trying out ohm-js and get a bit deeper into typescript types.
