package cmd

import (
	"github.com/spf13/cobra"
)

type schemaCmd struct {
	cmd *cobra.Command
}

func newSchemaCmd() *schemaCmd {
	root := &schemaCmd{}
	cmd := &cobra.Command{
		Use:   "schema",
		Short: "Create, Manage, and Version your Schemata",
	}

	root.cmd = cmd
	return root
}
