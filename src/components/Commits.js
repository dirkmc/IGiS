import React, { Component } from 'react'
import CommitList from "./CommitList"
import GitCommit from '../lib/git/GitCommit'
import { Link } from 'react-router-dom'

class Commits extends Component {
  constructor(props) {
    super(props)
    this.rowCount = 20
    this.state = { commits: [] }
  }

  render() {
    const pathname = this.props.location.pathname

    // /repo/<cid>/commits
    // or
    // /repo/<cid>/commits/<commit cid>
    const parts = pathname.split('/')
    const basePath = parts.slice(0, 2).join('/')
    const repoCid = parts[2]
    const commitCid = parts[4]

    // If we have not yet fetched the data for the commit list, continue with
    // rendering but trigger a fetch in the background (which will
    // call render again on completion)
    this.triggerFetch(commitCid || repoCid)

    // If there is another commit in the list, show the more link
    let more = null
    if (this.state.commits.length > this.rowCount) {
      const nextCommit = this.state.commits[this.rowCount]
      more = <Link to={`${basePath}/${repoCid}/commits/${nextCommit.cid}`}>More ▾</Link>
    }

    return (
      <div className="Commits">
        <CommitList path={basePath} commits={this.state.commits.slice(0, this.rowCount)} />
        <div className="more-link">
          {more}
        </div>
      </div>
    )
  }

  triggerFetch(commitCid) {
    if (this.fetchedCommit === commitCid) return
    this.fetchedCommit = commitCid

    // fetch one extra row for pagination purposes
    GitCommit.fetchCommitAndParents(commitCid, this.rowCount + 1, commits => {
      this.setState({ commits })
    })
  }
}

export default Commits