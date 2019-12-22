import React from 'react';
import PlaylistHeader from './PlaylistHeader'
import PlaylistRow from './PlaylistRow';

function PlaylistTable () {
  return (
    <table>
            <PlaylistHeader/>
            <PlaylistRow/>
    </table>
  );
}

export default PlaylistTable;