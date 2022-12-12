## TableList Component

# columnHeaders should be an array of objects with the following shape:

```
{
Header: string,
Cell?: (props) => JSX.Element,
accessor: string
}
```

# rowData should be an array of objects with whatever shape you defined in the columnHeaders array. For example, if you defined in one of the columnHeaders:

```
{
accessor: 'testColumn
}
```

# Now, in the rowData object, you can pass a value down that specific column by passing the following object in the rowData array

```
{
testColumn: 'This is a cell value'
}
```

Notice that the key for the the rowData object has the same name of the value we passed to the columnHeader accessor.

# If you would like every Cell in a column to have customization with JSX, you can specify the Cell property in the columnHeader object as such

```
{
  Cell: (props) => {
  return <h1>{props.original.testColumn}</h1>
  }
}
```

Notice how we can pass props to the Cell JSX. The original property within the props object will be where you can retrieve all of the row specific information that you initially passed in the
rowData object (line 20 of this README).
