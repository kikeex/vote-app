import {
  commitMutation,
  graphql,
} from 'react-relay'
import environment from './createRelayEnvironment'
import {ConnectionHandler} from 'relay-runtime'

const mutation = graphql`
  mutation CreateTopicMutation($input: CreateTopicInput!) {
    createTopic(input: $input) {
      topic {
        id
        title
        description        
      }
    }
  }
`;

let tempID = 0;

export default function CreateTopicMutation(description, title, viewerId, callback) {
  const variables = {
    input: {
      description,
      title,
      status: 'Proposal',
      clientMutationId: ""
    },
  }
  commitMutation(
    environment,
    {
      mutation,
      variables,
      onCompleted: (response) => {
        console.log(response, environment)
        callback()
      },
      onError: err => console.error(err),
      optimisticUpdater: (proxyStore) => {
        // 1 - create the `newTopic` as a mock that can be added to the store
        const id = 'client:newTopic:' + tempID++
        const newTopic = proxyStore.create(id, 'Topic')
        newTopic.setValue(id, 'id')
        newTopic.setValue(description, 'description')
        newTopic.setValue(title, 'title')

        // 2 - add `newTopic` to the store
        const viewerProxy = proxyStore.get(viewerId)
        const connection = ConnectionHandler.getConnection(viewerProxy, 'ListPage_allTopics')
        if (connection) {
          ConnectionHandler.insertEdgeAfter(connection, newTopic)
        }
      },
      updater: (proxyStore) => {
        // 1 - retrieve the `newTopic` from the server response
        const createTopicField = proxyStore.getRootField('createTopic')
        const newTopic = createTopicField.getLinkedRecord('Topic')

        // 2 - add `newTopic` to the store
        const viewerProxy = proxyStore.get(viewerId)
        const connection = ConnectionHandler.getConnection(viewerProxy, 'ListPage_allTopics')
        if (connection) {
          ConnectionHandler.insertEdgeAfter(connection, newTopic)
        }
      },
    },
  )
}