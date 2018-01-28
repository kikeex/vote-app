import { withRouter } from 'react-router'
import CreateTopicMutation  from './CreateTopicMutation.js'
import { Link } from 'react-router-dom'
import React, { Component } from 'react';

import {
  createFragmentContainer,
  graphql,
} from 'react-relay';

import { QueryRenderer } from 'react-relay';
import environment from './createRelayEnvironment.js'

let badgeClasses = {
  'Proposal': 'secondary',
  'Draft': 'primary',
  'OnHold': 'info',
  'Rejected': 'light',
  'Published': 'success'
}

const CreateTopicViewerQuery = graphql`
  query CreateTopicViewerQuery {
    viewer {
      id
    }
  }
`;

class CreateTopic extends React.Component {

  state = {
    description: '',
    title: '',
  }

  render () {
    return (
      <QueryRenderer 
        environment={environment}
        query={CreateTopicViewerQuery}
        render={({error, props}) => {
          if (error) {
            return (
              <div>{error.message}</div>
            )
          } else if (props) {
            return (
              <div className='w-100 pa4 flex justify-center'>
                <div style={{ maxWidth: 400 }} className=''>
                  <input
                    className='w-100 pa3 mv2'
                    value={this.state.title}
                    placeholder='Title'
                    onChange={(e) => this.setState({title: e.target.value})}
                  />
                  <input
                    className='w-100 pa3 mv2'
                    value={this.state.description}
                    placeholder='Description'
                    onChange={(e) => this.setState({description: e.target.value})}
                  />
                  {this.state.title &&
                    <img 
                      src={this.state.title} 
                      alt={this.state.description} 
                      className='w-100 mv3' 
                    />
                  }
                  {this.state.description && this.state.title &&
                    <button className='pa3 bg-black-10 bn dim ttu pointer' onClick={() => this._handlePost(props.viewer.id)}>Post</button>
                  }
                  <div style={{textAlign: "center", color: "red"}}>
                    <Link to="/" >Cancel</Link>
                  </div>
                </div>
              </div>
            )
          }
          return (<div>loading</div>)
        }}
      />
    )
  }

  _handlePost = (viewerId) => {
    const {description, title} = this.state
    CreateTopicMutation(description, title, viewerId,  () => this.props.history.replace('/app'))
  }

}

export default withRouter(CreateTopic)

// class Topic extends Component {
//   render() {
//     console.log(this.props.match.params.topicId)
//     return (
//       <QueryRenderer
//         environment={environment}
//         query={graphql`
//           query TopicQuery ($topicId: ID!) {
//             viewer {
//             Topic (id: $topicId) {                 
//                 id
//                 title
//                 votes
//                 status
//                 description
//             }
//           }
//           }
//         `}
//         variables={{
//           topicId: this.props.match.params.topicId
//         }}
//         render={({ error, props }) => {
//           if (error) {
//             return <div>Error!</div>;
//           }
//           if (!props) {
//             return <div>Loading...</div>;
//           }
//           console.log(props)
//           const {title, description, votes, status} = props.viewer.Topic
//           return <div>
//             <h2>{title}</h2>
//             <p>{description}</p>
//             <p>Votes for this course so far: {votes}</p>
//             <p>Status: {status}</p>
//             <Link to="/app">Home</Link>
//           </div>
//         }}
//       />      

//     );
//   }
// }

// // export default createFragmentContainer(Topic, {
// //   topic: graphql`
// //     fragment Topic_topic on Topic {
// //       title,
// //       id,
// //       description,
// //       votes,
// //       status
// //     }
// //   `,
// //   viewer: graphql`
// //     fragment Topic_viewer on User {
// //       id
// //     }
// //   `,
// // });