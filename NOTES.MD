# Domain-Driven Frontend Notes

## Vocabulary

### Entity

An object defined primarily by its identity that can change over time.

### Repository 

An object with the purpose of store and retrieve entities. Its form should be indipendent from the data source.

### Service

A Service is an object that orchestrates the steps required to fulfill the commands imposed by the client. Notice that in DDD there are three different kind of services: Domain, Application and Infrastructure. However, this classification lose some of its importance for a fronte-end application.
