import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import IconButton from '@material-ui/core/IconButton'
import FavoriteIcon from '@material-ui/icons/Favorite'
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder'

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    maxWidth: '36ch',
    backgroundColor: theme.palette.background.paper
  },
  inline: {
    display: 'inline'
  }
}))

function EmpoyeesList ({ employees, onPromoteClick }) {
  const classes = useStyles()

  const items = employees.map(employee => {
    const icon = employee.promoted ? <FavoriteIcon /> : <FavoriteBorderIcon />
    return (
      <ListItem key={employee.id} alignItems='flex-start'>
        <ListItemAvatar>
          <Avatar alt={employee.name} src={employee.avatar} />
        </ListItemAvatar>
        <ListItemText
          primary={employee.name}
        />
        <ListItemSecondaryAction>
          <IconButton edge='end' aria-label='comments' onClick={() => onPromoteClick(employee)} disabled={employee.promoted}>
            {icon}
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>
    )
  })

  return (
    <List className={classes.root}>
      {items}
    </List>
  )
}

export default EmpoyeesList
